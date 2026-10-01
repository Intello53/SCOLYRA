import { NextResponse } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@scolyra/db";
import { checkRateLimit } from "../../../lib/rate-limit";
import { LEGAL } from "../../../lib/legal";
import { createGuardianInvite } from "../../../lib/guardian";
import {
  getOptionsForLevel,
  getSpecialtiesForLevel,
  getMaxSpecialties,
  type SchoolLevelCode,
} from "../../../lib/curriculum";

const SCHOOL_LEVEL_VALUES = [
  "COLLEGE_6E",
  "COLLEGE_5E",
  "COLLEGE_4E",
  "COLLEGE_3E",
  "LYCEE_2NDE",
  "LYCEE_1ERE",
  "LYCEE_TERMINALE",
  "POST_BAC",
] as const;

const AGE_BRACKETS = ["UNDER_15", "AGE_15_17", "ADULT"] as const;

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    email: z.string().email().max(254),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.").max(200),
    // Tranche d'âge déclarée (loi Informatique et Libertés art. 45 : seuil de 15 ans en France).
    // On ne demande PAS la date de naissance : la tranche suffit (minimisation).
    ageBracket: z.enum(AGE_BRACKETS),
    // Obligatoire pour les moins de 15 ans : accord du représentant légal.
    guardianEmail: z.string().email().max(254).optional(),
    schoolLevel: z.enum(SCHOOL_LEVEL_VALUES),
    establishment: z.string().max(160).optional(),
    options: z.array(z.string()).max(10).default([]),
    specialties: z.array(z.string()).max(3).default([]),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: "Tu dois accepter les CGU et reconnaître avoir pris connaissance de la politique de confidentialité." }),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.ageBracket === "UNDER_15") {
      if (!v.guardianEmail) {
        ctx.addIssue({ code: "custom", path: ["guardianEmail"], message: "L'e-mail d'un représentant légal est obligatoire avant 15 ans." });
      } else if (v.guardianEmail.toLowerCase().trim() === v.email.toLowerCase().trim()) {
        ctx.addIssue({ code: "custom", path: ["guardianEmail"], message: "L'e-mail du représentant légal doit être différent du tien." });
      }
    }
  });

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Toute la logique vit dans cette fonction, elle-même appelée depuis
 * POST() sous un try/catch global (voir plus bas). Avant cette
 * correction, une exception Prisma/argon2 non prévue remontait telle
 * quelle et Next.js renvoyait une page d'erreur HTML — le client
 * plantait alors sur `res.json()` et affichait le message trompeur
 * "Impossible de contacter le serveur", qui masquait la vraie cause.
 */
async function handleRegister(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit(`register:${ip}`, 5, 60 * 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Trop de tentatives d'inscription. Réessaie dans ${Math.ceil((rl.retryAfterSeconds ?? 3600) / 60)} min.` },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const level = data.schoolLevel as SchoolLevelCode;

  const allowedOptions = new Set(getOptionsForLevel(level).map((o) => o.code));
  const allowedSpecialties = new Set(getSpecialtiesForLevel(level).map((s) => s.code));
  const maxSpecialties = getMaxSpecialties(level);

  if (data.specialties.length > 0 && allowedSpecialties.size === 0) {
    return NextResponse.json({ error: `Le niveau ${level} n'a pas de spécialités.` }, { status: 400 });
  }
  if (data.specialties.length > maxSpecialties) {
    return NextResponse.json({ error: `Maximum ${maxSpecialties} spécialités pour ce niveau.` }, { status: 400 });
  }
  for (const code of data.options) {
    if (!allowedOptions.has(code)) {
      return NextResponse.json({ error: `Option invalide pour ce niveau : ${code}` }, { status: 400 });
    }
  }
  for (const code of data.specialties) {
    if (!allowedSpecialties.has(code)) {
      return NextResponse.json({ error: `Spécialité invalide pour ce niveau : ${code}` }, { status: 400 });
    }
  }

  const email = data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  let passwordHash: string;
  try {
    passwordHash = await argon2.hash(data.password);
  } catch (err) {
    // argon2 est un module natif compilé — s'il ne peut pas se charger
    // (ABI Node incompatible, build tools manquants...), il faut le
    // dire clairement plutôt que de laisser planter tout le endpoint.
    console.error("[register] Échec argon2.hash — module natif argon2 non fonctionnel :", err);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Une erreur est survenue. Réessaie dans un instant ou contacte l'assistance."
            : "Erreur serveur : le module de hachage des mots de passe (argon2) n'a pas pu s'exécuter. Vérifie les logs du serveur (terminal pnpm dev) et voir docs/TROUBLESHOOTING.md.",
      },
      { status: 500 }
    );
  }

  const allSelected = [
    ...getOptionsForLevel(level)
      .filter((o) => data.options.includes(o.code))
      .map((o) => ({ ...o, isSpecialty: false })),
    ...getSpecialtiesForLevel(level)
      .filter((s) => data.specialties.includes(s.code))
      .map((s) => ({ ...s, isSpecialty: true })),
  ];

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "STUDENT",
      isMinor: data.ageBracket !== "ADULT",
      profile: { create: { firstName: data.firstName } },
      studentProfile: {
        create: {
          schoolLevel: level,
          establishment: data.establishment || null,
          options: data.options,
          specialties: data.specialties,
        },
      },
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      orientationProfile: { create: {} },
      consents: {
        create: [
          { type: "TERMS_OF_SERVICE", granted: true, version: LEGAL.version },
          { type: "PRIVACY_POLICY", granted: true, version: LEGAL.version },
          // Moins de 15 ans : accès bloqué jusqu'à confirmation du représentant légal (voir lib/session.ts).
          ...(data.ageBracket === "UNDER_15"
            ? [{ type: "LEGAL_GUARDIAN_APPROVAL" as const, granted: false, version: LEGAL.version }]
            : []),
        ],
      },
    },
    include: { studentProfile: true },
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "ACCOUNT_CREATED", ip, metadata: { schoolLevel: level, ageBracket: data.ageBracket } },
  });

  for (const item of allSelected) {
    const subject = await prisma.subject.upsert({
      where: { name_createdById: { name: item.label, createdById: null } },
      update: {},
      create: { name: item.label, category: item.isSpecialty ? "Spécialité" : "Option" },
    });
    await prisma.userSubject.create({
      data: {
        studentProfileId: user.studentProfile!.id,
        subjectId: subject.id,
        isSpecialty: item.isSpecialty,
        includeInAverage: true,
      },
    });
  }

  let guardianEmailSent: boolean | undefined;
  if (data.ageBracket === "UNDER_15" && data.guardianEmail) {
    const invite = await createGuardianInvite({
      studentId: user.id,
      studentFirstName: data.firstName,
      guardianEmail: data.guardianEmail,
    });
    guardianEmailSent = invite.emailSent;
  }

  return NextResponse.json({
    ok: true,
    userId: user.id,
    awaitingGuardian: data.ageBracket === "UNDER_15",
    guardianEmailSent,
  });
}

export async function POST(req: Request) {
  try {
    return await handleRegister(req);
  } catch (err) {
    // Filet de sécurité final : quoi qu'il arrive, le client reçoit du
    // JSON exploitable, jamais une page d'erreur HTML qui ferait
    // planter res.json() côté client avec un message trompeur.
    console.error("[register] Erreur non gérée :", err);
    // Le détail technique n'est renvoyé qu'en développement : en production il révélerait
    // des informations internes (chemins, requêtes, versions) à n'importe quel visiteur.
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Une erreur est survenue. Réessaie dans un instant ou contacte l'assistance."
            : `Erreur serveur inattendue : ${detail}`,
      },
      { status: 500 }
    );
  }
}

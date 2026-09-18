import { NextResponse } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@scolyra/db";
import { checkRateLimit } from "../../../lib/rate-limit";
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

const registerSchema = z.object({
  firstName: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  isMinor: z.boolean(),
  schoolLevel: z.enum(SCHOOL_LEVEL_VALUES),
  establishment: z.string().max(160).optional(),
  options: z.array(z.string()).max(10).default([]),
  specialties: z.array(z.string()).max(3).default([]),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Tu dois accepter les CGU et la politique de confidentialité." }),
  }),
});

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  // Protection brute-force / spam : 5 inscriptions max / heure / IP.
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
      { error: "Données invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const level = data.schoolLevel as SchoolLevelCode;

  // Validation métier : une classe donnée n'a pas forcément de spécialités
  // (ex. 2de, collège) — on rejette côté serveur, pas seulement côté UI.
  const allowedOptions = new Set(getOptionsForLevel(level).map((o) => o.code));
  const allowedSpecialties = new Set(getSpecialtiesForLevel(level).map((s) => s.code));
  const maxSpecialties = getMaxSpecialties(level);

  if (data.specialties.length > 0 && allowedSpecialties.size === 0) {
    return NextResponse.json(
      { error: `Le niveau ${level} n'a pas de spécialités.` },
      { status: 400 }
    );
  }
  if (data.specialties.length > maxSpecialties) {
    return NextResponse.json(
      { error: `Maximum ${maxSpecialties} spécialités pour ce niveau.` },
      { status: 400 }
    );
  }
  for (const code of [...data.options]) {
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

  const passwordHash = await argon2.hash(data.password);

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
      isMinor: data.isMinor,
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
          { type: "TERMS_OF_SERVICE", granted: true, version: "2026-09-v1" },
          { type: "PRIVACY_POLICY", granted: true, version: "2026-09-v1" },
        ],
      },
    },
    include: { studentProfile: true },
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "ACCOUNT_CREATED", ip, metadata: { schoolLevel: level } },
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

  return NextResponse.json({ ok: true, userId: user.id });
}

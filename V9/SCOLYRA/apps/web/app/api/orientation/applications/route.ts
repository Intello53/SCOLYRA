import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const applicationSchema = z.object({
  formationName: z.string().min(1).max(200),
  establishment: z.string().max(200).optional(),
  domain: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  // Saisie manuelle : jamais marquée comme vérifiée (§19/§47 — on n'invente
  // jamais de données officielles). isVerified reste false.
  const formation = await prisma.formation.create({
    data: {
      name: parsed.data.formationName,
      establishment: parsed.data.establishment,
      domain: parsed.data.domain,
      isVerified: false,
    },
  });

  const application = await prisma.application.create({
    data: { userId: user.id, formationId: formation.id, status: "DRAFT" },
    include: { formation: true },
  });

  return NextResponse.json({ application });
}

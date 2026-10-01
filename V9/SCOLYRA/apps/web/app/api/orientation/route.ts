import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const patchSchema = z.object({
  desiredFields: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  geographicMaxDistanceKm: z.number().min(0).max(2000).nullable().optional(),
  geographicPreferredRegions: z.array(z.string()).max(20).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const [profile, applications] = await Promise.all([
    prisma.orientationProfile.findUnique({ where: { userId: user.id } }),
    prisma.application.findMany({
      where: { userId: user.id },
      include: { formation: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return NextResponse.json({ profile, applications });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const profile = await prisma.orientationProfile.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: { userId: user.id, ...parsed.data },
  });
  return NextResponse.json({ profile });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../../lib/session";

const patchSchema = z.object({ premiumOnly: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const flag = await prisma.featureFlag.update({
    where: { id: params.id },
    data: { premiumOnly: parsed.data.premiumOnly },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "FEATURE_FLAG_UPDATED",
      metadata: { key: flag.key, premiumOnly: flag.premiumOnly },
    },
  });

  return NextResponse.json({ flag });
}

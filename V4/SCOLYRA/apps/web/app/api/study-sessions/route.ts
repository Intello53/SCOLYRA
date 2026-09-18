import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const sessionSchema = z.object({
  title: z.string().min(1).max(160),
  subjectId: z.string().optional(),
  startAt: z.string(), // ISO datetime
  endAt: z.string(),
});

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const sessions = await prisma.studySession.findMany({
    where: {
      userId: user.id,
      ...(from && to ? { startAt: { gte: new Date(from), lte: new Date(to) } } : {}),
    },
    include: { subject: true },
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  }

  const created = await prisma.studySession.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      subjectId: parsed.data.subjectId || null,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
    },
  });
  return NextResponse.json({ session: created });
}

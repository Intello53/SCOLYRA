import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const DOCUMENT_TYPES = ["COURSE", "PDF", "COPY", "SHEET", "OTHER"] as const;

const createSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(DOCUMENT_TYPES).default("PDF"),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  const documents = await prisma.document.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ documents });
}

/**
 * Aucun vrai fichier n'est stocké ici (pas de MinIO branché en V0,
 * voir docs/ROADMAP.md) — on crée l'enregistrement Document avec un
 * storageKey factice et un statut qui passera à READY après un délai
 * simulé (voir PATCH). C'est un enregistrement réel en base, pas un
 * état local qui disparaît au rafraîchissement — seul le fichier
 * physique lui-même n'est pas persisté.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      type: parsed.data.type,
      status: "UPLOADED",
      storageKey: `simulated/${user.id}/${Date.now()}`,
    },
  });

  return NextResponse.json({ document });
}

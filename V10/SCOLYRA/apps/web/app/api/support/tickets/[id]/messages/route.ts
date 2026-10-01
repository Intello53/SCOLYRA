import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../../../lib/session";

const messageSchema = z.object({ content: z.string().min(1).max(5000) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const ticket = await prisma.supportTicket.findUnique({ where: { id: params.id } });
  if (!ticket) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  if (user.role !== "ADMIN" && ticket.userId !== user.id) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message invalide." }, { status: 400 });

  const authorRole = user.role === "ADMIN" ? "ADMIN" : "STUDENT";

  const message = await prisma.supportMessage.create({
    data: { ticketId: params.id, authorRole, content: parsed.data.content },
  });

  // Une réponse admin marque le ticket "répondu" ; un message d'élève
  // sur un ticket déjà traité le repasse "ouvert" (l'admin doit le
  // revoir). Un ticket CLOSED explicitement ne change pas tout seul.
  if (ticket.status !== "CLOSED") {
    await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status: authorRole === "ADMIN" ? "ANSWERED" : "OPEN" },
    });
  }

  return NextResponse.json({ message });
}

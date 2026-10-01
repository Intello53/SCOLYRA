import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../../lib/session";

async function canAccessTicket(userId: string, role: string, ticketId: string) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) return null;
  if (role !== "ADMIN" && ticket.userId !== userId) return null;
  return ticket;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const ticket = await canAccessTicket(user.id, user.role, params.id);
  if (!ticket) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  const messages = await prisma.supportMessage.findMany({
    where: { ticketId: params.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ ticket, messages });
}

const patchSchema = z.object({ status: z.enum(["OPEN", "ANSWERED", "CLOSED"]) });

/** Changement de statut réservé à l'admin (un élève ne "ferme" pas lui-même un ticket). */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const ticket = await prisma.supportTicket.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ticket });
}

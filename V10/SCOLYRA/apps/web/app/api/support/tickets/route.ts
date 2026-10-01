import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const createSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

/**
 * Un élève ne voit que SES tickets ; un admin voit tous les tickets
 * (c'est la vue utilisée par /admin/support). Un seul endpoint, le
 * filtrage dépend du rôle de la session — jamais d'un paramètre
 * transmis par le client.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const tickets = await prisma.supportTicket.findMany({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" }, take: 1 },
      user: { include: { profile: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ tickets });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user.id,
      subject: parsed.data.subject,
      status: "OPEN",
      messages: { create: { authorRole: "STUDENT", content: parsed.data.message } },
    },
    include: { messages: true },
  });

  await prisma.auditLog.create({ data: { userId: user.id, action: "SUPPORT_TICKET_CREATED" } });

  return NextResponse.json({ ticket });
}

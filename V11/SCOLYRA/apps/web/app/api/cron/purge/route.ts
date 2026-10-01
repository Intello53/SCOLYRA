import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@scolyra/db";
import { LEGAL } from "../../../../lib/legal";

/**
 * Purge des données arrivées au terme de leur durée de conservation
 * (RGPD art. 5.1.e — limitation de la conservation). Les durées viennent de
 * LEGAL.retention et sont celles annoncées dans la politique de
 * confidentialité : toute modification doit être faite aux deux endroits.
 *
 * À appeler chaque jour par un cron externe :
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/cron/purge
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false;
  const header = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const monthsAgo = (m: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  return d;
};
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export async function POST(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET non configuré." }, { status: 503 });
  }
  if (!authorized(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const r = LEGAL.retention;

  // 1. Journal de sécurité (contient des adresses IP)
  const logs = await prisma.auditLog.deleteMany({ where: { createdAt: { lt: monthsAgo(r.securityLogsMonths) } } });

  // 2. Invitations de représentant légal non validées + comptes « PARENT » orphelins
  const staleLinks = await prisma.legalGuardianLink.findMany({
    where: { verified: false, createdAt: { lt: daysAgo(r.unverifiedGuardianDays) } },
    select: { id: true, guardianId: true },
  });
  await prisma.legalGuardianLink.deleteMany({ where: { id: { in: staleLinks.map((l) => l.id) } } });
  let orphanGuardians = 0;
  for (const guardianId of new Set(staleLinks.map((l) => l.guardianId))) {
    if ((await prisma.legalGuardianLink.count({ where: { guardianId } })) === 0) {
      orphanGuardians += (await prisma.user.deleteMany({ where: { id: guardianId, role: "PARENT" } })).count;
    }
  }

  // 3. Tickets d'assistance clos depuis longtemps
  const tickets = await prisma.supportTicket.deleteMany({
    where: { status: "CLOSED", updatedAt: { lt: monthsAgo(r.supportTicketsMonthsAfterClose) } },
  });

  // 4. Comptes élèves inactifs (jamais les abonnés Premium actifs : leur résiliation passe par Stripe)
  const cutoff = monthsAgo(r.inactiveAccountMonths);
  const inactive = await prisma.user.deleteMany({
    where: {
      role: "STUDENT",
      OR: [{ lastLoginAt: { lt: cutoff } }, { lastLoginAt: null, createdAt: { lt: cutoff } }],
      NOT: { subscription: { is: { plan: "PREMIUM", status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } } } },
    },
  });

  return NextResponse.json({
    ok: true,
    purged: { auditLogs: logs.count, staleGuardianLinks: staleLinks.length, orphanGuardians, closedTickets: tickets.count, inactiveAccounts: inactive.count },
  });
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Badge } from "./ui";
import { Button } from "./button";

type Message = { id: string; authorRole: "STUDENT" | "ADMIN"; content: string; createdAt: string };
type Ticket = {
  id: string;
  subject: string;
  status: string;
  updatedAt: string;
  user: { email: string; profile: { firstName: string } | null };
};

const STATUS_LABEL: Record<string, string> = { OPEN: "Ouvert", ANSWERED: "Répondu", CLOSED: "Fermé" };
const STATUS_TONE: Record<string, "primary" | "mastery" | "neutral"> = {
  OPEN: "primary",
  ANSWERED: "mastery",
  CLOSED: "neutral",
};

export function AdminSupportClient({ tickets }: { tickets: Ticket[] }) {
  const router = useRouter();
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const openTicket = tickets.find((t) => t.id === openTicketId);

  async function open(id: string) {
    setOpenTicketId(id);
    setLoadingThread(true);
    const res = await fetch(`/api/support/tickets/${id}`);
    const data = await res.json();
    setLoadingThread(false);
    if (res.ok) setThreadMessages(data.messages);
  }

  async function sendReply() {
    if (!reply.trim() || !openTicketId) return;
    setSending(true);
    const res = await fetch(`/api/support/tickets/${openTicketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply }),
    });
    setSending(false);
    if (!res.ok) return;
    const data = await res.json();
    setThreadMessages((prev) => [...prev, data.message]);
    setReply("");
    router.refresh();
  }

  async function setStatus(status: string) {
    if (!openTicketId) return;
    setUpdatingStatus(true);
    await fetch(`/api/support/tickets/${openTicketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdatingStatus(false);
    router.refresh();
  }

  if (openTicketId && openTicket) {
    return (
      <div>
        <button onClick={() => setOpenTicketId(null)} className="focus-ring mb-4 text-sm text-primary-600 hover:underline">
          ← Retour à tous les tickets
        </button>
        <Panel className="flex min-h-[400px] flex-col">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900 dark:text-white">{openTicket.subject}</h2>
            <Badge tone={STATUS_TONE[openTicket.status]}>{STATUS_LABEL[openTicket.status]}</Badge>
          </div>
          <p className="mb-4 text-xs text-ink-900/45 dark:text-white/45">
            {openTicket.user.profile?.firstName ?? openTicket.user.email} · {openTicket.user.email}
          </p>

          {loadingThread ? (
            <p className="text-sm text-ink-900/45 dark:text-white/45">Chargement…</p>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto">
              <AnimatePresence initial={false}>
                {threadMessages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.authorRole === "ADMIN" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                        m.authorRole === "ADMIN"
                          ? "bg-primary-600 text-white"
                          : "bg-ink-900/5 text-ink-900 dark:bg-white/10 dark:text-white"
                      }`}
                    >
                      <p className="mb-1 text-xs opacity-60">{m.authorRole === "ADMIN" ? "Toi (admin)" : "Élève"}</p>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-4 flex gap-2 border-t border-ink-900/8 pt-4 dark:border-white/8">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
              placeholder="Répondre…"
              className="focus-ring flex-1 rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <Button onClick={sendReply} disabled={sending}>{sending ? "…" : "Répondre"}</Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={() => setStatus("CLOSED")} disabled={updatingStatus}>
              Marquer comme fermé
            </Button>
            {openTicket.status === "CLOSED" && (
              <Button variant="secondary" onClick={() => setStatus("OPEN")} disabled={updatingStatus}>
                Rouvrir
              </Button>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <Panel className="!p-0">
      <div className="divide-y divide-ink-900/8 dark:divide-white/8">
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => open(t.id)}
            className="focus-ring flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-ink-900/[0.02] dark:hover:bg-white/5"
          >
            <div>
              <p className="text-sm text-ink-900 dark:text-white">{t.subject}</p>
              <p className="text-xs text-ink-900/45 dark:text-white/45">
                {t.user.profile?.firstName ?? t.user.email} · {new Date(t.updatedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
          </button>
        ))}
        {tickets.length === 0 && (
          <p className="px-5 py-6 text-center text-sm text-ink-900/45 dark:text-white/45">Aucun ticket pour l'instant.</p>
        )}
      </div>
    </Panel>
  );
}

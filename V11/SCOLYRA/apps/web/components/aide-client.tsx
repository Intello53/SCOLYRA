"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Badge, EmptyState } from "./ui";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type Message = { id: string; authorRole: "STUDENT" | "ADMIN"; content: string; createdAt: string };
type Ticket = { id: string; subject: string; status: string; updatedAt: string; messages?: Message[] };

const STATUS_LABEL: Record<string, string> = { OPEN: "Ouvert", ANSWERED: "Répondu", CLOSED: "Fermé" };
const STATUS_TONE: Record<string, "primary" | "mastery" | "neutral"> = {
  OPEN: "primary",
  ANSWERED: "mastery",
  CLOSED: "neutral",
};

export function AideClient({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [tickets] = useState(initialTickets);
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openTicket(id: string) {
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
  }

  async function createTicket() {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'envoi.");
      return;
    }
    setSubject("");
    setMessage("");
    setCreating(false);
    celebrate("Ta demande a été envoyée");
    router.refresh();
  }

  if (openTicketId) {
    const ticket = tickets.find((t) => t.id === openTicketId);
    return (
      <div>
        <button onClick={() => setOpenTicketId(null)} className="focus-ring mb-4 text-sm text-primary-600 hover:underline">
          ← Retour à mes demandes
        </button>
        <Panel className="flex min-h-[400px] flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900 dark:text-white">{ticket?.subject}</h2>
            {ticket && <Badge tone={STATUS_TONE[ticket.status]}>{STATUS_LABEL[ticket.status]}</Badge>}
          </div>

          {loadingThread ? (
            <p className="text-sm text-ink-900/60 dark:text-white/55">Chargement…</p>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto">
              <AnimatePresence initial={false}>
                {threadMessages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.authorRole === "STUDENT" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                        m.authorRole === "STUDENT"
                          ? "bg-primary-600 text-white"
                          : "bg-ink-900/5 text-ink-900 dark:bg-white/10 dark:text-white"
                      }`}
                    >
                      <p className="mb-1 text-xs opacity-60">{m.authorRole === "ADMIN" ? "SCOLYRA" : "Toi"}</p>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {ticket?.status !== "CLOSED" && (
            <div className="mt-4 flex gap-2 border-t border-ink-900/8 pt-4 dark:border-white/8">
              <input aria-label="Ta réponse"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Écris ta réponse…"
                className="focus-ring flex-1 rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
              />
              <Button onClick={sendReply} disabled={sending}>{sending ? "…" : "Envoyer"}</Button>
            </div>
          )}
        </Panel>
      </div>
    );
  }

  return (
    <div>
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {tickets.length === 0 && !creating ? (
        <EmptyState
          title="Aucune demande envoyée"
          description="Une question, un bug, un problème avec ton compte ? Écris-nous."
          action={<Button className="mt-2" onClick={() => setCreating(true)}>+ Nouvelle demande</Button>}
        />
      ) : (
        <Panel className="!p-0">
          <div className="divide-y divide-ink-900/8 dark:divide-white/8">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => openTicket(t.id)}
                className="focus-ring flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-ink-900/[0.02] dark:hover:bg-white/5"
              >
                <div>
                  <p className="text-sm text-ink-900 dark:text-white">{t.subject}</p>
                  <p className="text-xs text-ink-900/60 dark:text-white/55">
                    {new Date(t.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {creating ? (
        <Panel className="mt-6 space-y-3">
          <input aria-label="Sujet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet (ex: Impossible d'ajouter une note)"
            className="focus-ring w-full rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
          />
          <textarea aria-label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décris ta question ou le problème rencontré…"
            rows={4}
            className="focus-ring w-full rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={createTicket} disabled={submitting}>{submitting ? "…" : "Envoyer"}</Button>
            <Button variant="secondary" onClick={() => setCreating(false)}>Annuler</Button>
          </div>
        </Panel>
      ) : (
        tickets.length > 0 && (
          <Button variant="secondary" className="mt-6" onClick={() => setCreating(true)}>+ Nouvelle demande</Button>
        )
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Panel, Badge } from "../../../components/ui";
import { TypingIndicator } from "../../../components/typing-indicator";

type Message = { role: "user" | "assistant"; content: string };

const STARTER: Message = {
  role: "assistant",
  content: "Pose-moi une question sur une matière, un objectif, tes révisions ou ton orientation — je regarde ton vrai profil pour répondre.",
};

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([STARTER]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setError(null);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setTyping(false);
      if (!res.ok) {
        setError(data.error ?? "Le coach n'a pas pu répondre.");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setTyping(false);
      setError("Impossible de contacter le serveur.");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Coach IA"
        description="Pose une question sur une matière, une révision, un projet ou ton orientation."
        action={<Badge tone="neutral">AI_PROVIDER=mock</Badge>}
      />

      <Panel className="flex min-h-[460px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-ink-900/5 text-ink-900 dark:bg-white/10 dark:text-white"
                  }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex gap-2 border-t border-ink-900/8 pt-4 dark:border-white/8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Écris ta question…"
            className="focus-ring flex-1 rounded-lg border border-ink-900/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
          />
          <motion.button
            onClick={send}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="focus-ring rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Envoyer
          </motion.button>
        </div>
      </Panel>

      <p className="mt-4 text-xs text-ink-900/40 dark:text-white/40">
        Les réponses s'appuient sur tes vraies données (objectifs, erreurs,
        orientation) via l'orchestrateur IA, mais le raisonnement reste
        celui du mode mock tant qu'aucun vrai fournisseur IA n'est
        configuré (voir docs/AI.md).
      </p>
    </div>
  );
}

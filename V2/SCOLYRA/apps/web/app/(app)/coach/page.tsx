"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Panel, Badge } from "../../../components/ui";
import { TypingIndicator } from "../../../components/typing-indicator";
import { demoCoachConversation } from "../../../lib/demo-data";

const MOCK_REPLIES = [
  "[MOCK] Bonne question — reprends d'abord les bases avec 2-3 exercices simples, puis complexifie progressivement.",
  "[MOCK] D'après ton profil de démonstration, c'est une notion récurrente dans tes erreurs récentes. Je te la place en priorité haute.",
  "[MOCK] Essaie de reformuler la méthode avec tes propres mots avant de refaire un exercice — ça consolide mieux que la répétition seule.",
];

type Message = { role: "user" | "assistant"; content: string };

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>(demoCoachConversation as Message[]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setTyping(false);
    }, 1100 + Math.random() * 500);
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
        Conversation de démonstration — réponses tirées d'un jeu de
        réponses fixes en mode mock, pas d'un vrai raisonnement IA (voir
        docs/AI.md).
      </p>
    </div>
  );
}

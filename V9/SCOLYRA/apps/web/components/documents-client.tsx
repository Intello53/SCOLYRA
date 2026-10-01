"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Panel, Badge, EmptyState } from "./ui";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type DocumentItem = { id: string; title: string; type: string; status: string; createdAt: string };

const TYPE_LABEL: Record<string, string> = {
  COURSE: "Cours",
  PDF: "PDF",
  COPY: "Copie",
  SHEET: "Fiche",
  OTHER: "Autre",
};

export function DocumentsClient({ documents: initialDocuments }: { documents: DocumentItem[] }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const celebrate = useCelebrate();

  async function importDocument() {
    const name = title.trim() || `Document ${documents.length + 1}`;
    setCreating(true);
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name, type: "PDF" }),
    });
    setCreating(false);
    if (!res.ok) return;
    const { document } = await res.json();
    setDocuments((prev) => [document, ...prev]);
    setTitle("");

    // Simule le traitement (pas de vrai pipeline OCR/embeddings en V0,
    // voir docs/ROADMAP.md) — mais le statut final est bien persisté.
    setTimeout(async () => {
      const patchRes = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READY" }),
      });
      if (patchRes.ok) {
        setDocuments((prev) => prev.map((d) => (d.id === document.id ? { ...d, status: "READY" } : d)));
        celebrate(`${name} analysé`);
      }
    }, 1800);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom du document (ex: DS Probabilités corrigé)"
          className="focus-ring min-w-[240px] flex-1 rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
        />
        <Button onClick={importDocument} disabled={creating}>
          {creating ? "Import…" : "Importer un document"}
        </Button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="Aucun document pour l'instant"
          description="Importe un cours, une copie corrigée ou une fiche pour que le coach IA puisse en tenir compte."
        />
      ) : (
        <Panel>
          <div className="divide-y divide-ink-900/8 dark:divide-white/8">
            <AnimatePresence initial={false}>
              {documents.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{d.title}</p>
                    <p className="text-xs text-ink-900/50 dark:text-white/50">
                      {TYPE_LABEL[d.type] ?? d.type} · {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={d.status}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge tone={d.status === "READY" ? "mastery" : "gold"}>
                        {d.status === "READY" ? "Analysé" : d.status === "PROCESSING" ? "En traitement" : "Importé"}
                      </Badge>
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      )}

      <p className="mt-4 text-xs text-ink-900/40 dark:text-white/40">
        L'enregistrement du document est réel (persisté en base). Aucun fichier n'est réellement stocké ni analysé —
        le pipeline OCR/embeddings reste à implémenter (docs/ROADMAP.md).
      </p>
    </div>
  );
}

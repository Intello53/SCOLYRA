"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Panel, Badge, EmptyState } from "../../../components/ui";
import { Button } from "../../../components/button";
import { useCelebrate } from "../../../components/celebration";
import { demoDocuments } from "../../../lib/demo-data";

export default function DocumentsPage() {
  const [docs, setDocs] = useState(demoDocuments.map((d) => ({ ...d })));
  const celebrate = useCelebrate();

  function importDemoDocument() {
    const name = `Nouveau document ${docs.length + 1}.pdf`;
    setDocs((prev) => [{ name, subject: "Mathématiques", status: "En traitement", uploadedDaysAgo: 0 }, ...prev]);
    setTimeout(() => {
      setDocs((prev) => prev.map((d) => (d.name === name ? { ...d, status: "Analysé" } : d)));
      celebrate(`${name} analysé`);
    }, 1800);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Documents"
        description="Cours, copies et fiches — analysés pour alimenter ton profil pédagogique."
        action={<Button onClick={importDemoDocument}>Importer un document</Button>}
      />

      {docs.length === 0 ? (
        <EmptyState
          title="Aucun document pour l'instant"
          description="Importe un cours, une copie corrigée ou une fiche pour que le coach IA puisse en tenir compte."
        />
      ) : (
        <Panel>
          <div className="divide-y divide-ink-900/8 dark:divide-white/8">
            <AnimatePresence initial={false}>
              {docs.map((d) => (
                <motion.div
                  key={d.name}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{d.name}</p>
                    <p className="text-xs text-ink-900/50 dark:text-white/50">
                      {d.subject} · importé {d.uploadedDaysAgo === 0 ? "aujourd'hui" : `il y a ${d.uploadedDaysAgo} j`}
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
                      <Badge tone={d.status === "Analysé" ? "mastery" : "gold"}>{d.status}</Badge>
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      )}

      <p className="mt-4 text-xs text-ink-900/40 dark:text-white/40">
        L'import ci-dessus est simulé (aucun fichier réel n'est envoyé) — le
        pipeline OCR/embeddings réel reste à implémenter (docs/ROADMAP.md).
      </p>
    </div>
  );
}

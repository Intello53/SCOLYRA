"use client";

import { useState } from "react";

export function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-ink-950">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-white/40">{lang}</span>
        <button
          onClick={handleCopy}
          className="focus-ring rounded-md px-2 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-sm text-white/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}

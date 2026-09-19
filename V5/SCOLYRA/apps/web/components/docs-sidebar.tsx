"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_CHAPTERS } from "../lib/docs-content";

export function DocsSidebar() {
  const pathname = usePathname();
  const sections = Array.from(new Set(DOC_CHAPTERS.map((c) => c.section)));

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-900/8 py-8 pr-6 md:flex">
      <Link href="/docs" className="mb-6 font-display text-lg text-ink-900">
        Documentation
      </Link>
      <nav className="flex flex-col gap-5">
        {sections.map((section) => (
          <div key={section}>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-ink-900/40">
              {section}
            </p>
            <div className="flex flex-col gap-0.5">
              {DOC_CHAPTERS.filter((c) => c.section === section).map((c) => {
                const href = `/docs/${c.slug}`;
                const active = pathname === href;
                return (
                  <Link
                    key={c.slug}
                    href={href}
                    className={`focus-ring rounded-lg px-2.5 py-1.5 text-sm ${
                      active ? "bg-primary-50 text-primary-700" : "text-ink-900/60 hover:bg-ink-900/5 hover:text-ink-900"
                    }`}
                  >
                    {c.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

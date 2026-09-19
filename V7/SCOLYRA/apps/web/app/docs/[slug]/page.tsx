import Link from "next/link";
import { notFound } from "next/navigation";
import { DOC_CHAPTERS, getChapterBySlug, getChapterNeighbors } from "../../../lib/docs-content";
import { CodeBlock } from "../../../components/code-block";

export function generateStaticParams() {
  return DOC_CHAPTERS.map((c) => ({ slug: c.slug }));
}

export default function DocChapterPage({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) notFound();

  const { prev, next } = getChapterNeighbors(params.slug);

  return (
    <article className="max-w-2xl">
      <p className="mb-1 text-xs text-ink-900/40">
        <Link href="/docs" className="hover:text-ink-900/70">
          Documentation
        </Link>{" "}
        / {chapter.section}
      </p>
      <h1 className="font-display text-3xl text-ink-900">{chapter.title}</h1>
      <p className="mt-2 text-sm text-ink-900/55">{chapter.summary}</p>

      <div className="mt-8 space-y-5">
        {chapter.blocks.map((block, i) => {
          switch (block.type) {
            case "p":
              return (
                <p key={i} className="text-sm leading-relaxed text-ink-900/75">
                  {block.text}
                </p>
              );
            case "h2":
              return (
                <h2 key={i} className="pt-2 font-display text-xl text-ink-900">
                  {block.text}
                </h2>
              );
            case "code":
              return <CodeBlock key={i} lang={block.lang} code={block.code} />;
            case "list":
              return (
                <ul key={i} className="space-y-1.5 text-sm text-ink-900/75">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary-500">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            case "note":
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-4 text-sm ${
                    block.tone === "warn"
                      ? "border-gold-200 bg-gold-50 text-gold-800"
                      : "border-primary-200 bg-primary-50 text-primary-800"
                  }`}
                >
                  {block.text}
                </div>
              );
            case "table":
              return (
                <div key={i} className="overflow-hidden rounded-xl border border-ink-900/8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/8 bg-ink-900/[0.02] text-left">
                        {block.headers.map((h) => (
                          <th key={h} className="px-4 py-2 font-medium text-ink-900/60">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/8">
                      {block.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2 text-ink-900/75">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
          }
        })}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-ink-900/8 pt-6 text-sm">
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className="text-ink-900/60 hover:text-primary-600">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/docs/${next.slug}`} className="text-ink-900/60 hover:text-primary-600">
            {next.title} →
          </Link>
        )}
      </div>
    </article>
  );
}

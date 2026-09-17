import { PublicNav } from "../../components/public-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNav />
      <div className="mx-auto max-w-5xl px-6 py-14">{children}</div>
      <footer className="mt-20 border-t border-ink-900/8 py-8">
        <div className="mx-auto max-w-5xl px-6 text-sm text-ink-900/45">
          SCOLYRA — projet de démonstration. Les données affichées sont fictives.
        </div>
      </footer>
    </div>
  );
}

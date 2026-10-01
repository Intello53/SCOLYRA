import type { Metadata } from "next";

// Page atteinte via un lien contenant un jeton : jamais indexée, pas de referrer.
export const metadata: Metadata = {
  title: "Vérification du représentant légal",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

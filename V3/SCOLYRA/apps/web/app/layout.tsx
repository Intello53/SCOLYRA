import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "../components/auth-session-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SCOLYRA — copilote scolaire et orientation",
  description:
    "SCOLYRA construit et ajuste en continu le plan de travail d'un élève à partir de son niveau réel et de ses objectifs, et le relie à son orientation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink-900 antialiased dark:bg-ink-950 dark:text-white">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}

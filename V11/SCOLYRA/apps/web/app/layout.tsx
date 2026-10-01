import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "../components/auth-session-provider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — copilote scolaire et orientation`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — copilote scolaire et orientation`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary", title: SITE_NAME, description: SITE_DESCRIPTION },
  // Les zones connectées et l'API sont exclues de l'indexation dans leurs
  // propres layouts / robots.ts ; ici, le site public reste indexable.
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pas de maximumScale / userScalable=no : le zoom doit rester possible
  // (WCAG 1.4.4 — redimensionnement du texte, RGAA 10.4).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0D18" },
  ],
};

// Données structurées (schema.org) lisibles par les moteurs et les agents IA.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "fr-FR",
  audience: { "@type": "EducationalAudience", educationalRole: "student" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink-900 antialiased dark:bg-ink-950 dark:text-white">
        <a
          href="#contenu"
          className="sr-only z-[100] rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}

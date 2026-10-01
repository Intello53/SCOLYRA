/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Empêche le clickjacking (site intégré dans une iframe malveillante)
  { key: "X-Frame-Options", value: "DENY" },
  // Empêche le navigateur de deviner un type MIME différent (limite les attaques XSS)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Ne transmet pas l'URL complète comme référent vers des sites tiers
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive des API navigateur sensibles non utilisées par SCOLYRA
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS pendant 2 ans une fois servi en HTTPS (n'a pas d'effet en http://localhost)
  // Durcissement sans casser Next.js : pas de <object>/<embed>, pas de <base> détourné, formulaires
  // uniquement vers le site, interdiction d'être intégré dans une iframe. (Une CSP complète avec
  // nonces pour les scripts reste à mettre en place — voir docs/CONFORMITE.md.)
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@scolyra/ai", "@scolyra/db", "@scolyra/ui"],
  poweredByHeader: false, // ne pas annoncer "Next.js" dans les en-têtes de réponse
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Les réponses d'API contiennent des données personnelles : jamais mises en cache ni indexées.
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

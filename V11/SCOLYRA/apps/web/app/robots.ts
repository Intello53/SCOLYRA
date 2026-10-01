import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Zones privées (données d'élèves, potentiellement mineurs) : jamais indexées.
        disallow: [
          "/api/", "/admin", "/dashboard", "/profil", "/matieres", "/objectifs", "/revisions",
          "/calendrier", "/documents", "/projets", "/orientation", "/coach", "/parametres",
          "/aide", "/verification-representant",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

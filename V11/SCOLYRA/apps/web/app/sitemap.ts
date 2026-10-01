import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

const PUBLIC_PATHS = [
  "", "/about", "/pricing", "/docs", "/mentions-legales", "/confidentialite",
  "/cgu", "/cgv", "/cookies", "/retractation", "/accessibilite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.5 }));
}

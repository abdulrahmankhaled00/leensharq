import type { MetadataRoute } from "next";

const base = "https://leensharq.com";
const paths = ["", "/about", "/services", "/brands", "/projects", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.flatMap((p) => [
    { url: `${base}${p || "/"}`, lastModified: now, alternates: { languages: { ar: `${base}${p || "/"}`, en: `${base}/en${p}` } } },
    { url: `${base}/en${p}`, lastModified: now, alternates: { languages: { ar: `${base}${p || "/"}`, en: `${base}/en${p}` } } },
  ]);
}

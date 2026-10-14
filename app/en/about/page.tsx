import type { Metadata } from "next";
import { getContent } from "@/content";
import { About } from "@/components/pages/About";

export const metadata: Metadata = {
  title: "About Us | Leen Al Sharq Holding",
  description: "A Riyadh-based holding built on four disciplines: networking, measurement, power and tools.",
  alternates: { canonical: "/en/about", languages: { ar: "/about", en: "/en/about" } },
};

export default function Page() {
  return <About content={getContent("en")} />;
}

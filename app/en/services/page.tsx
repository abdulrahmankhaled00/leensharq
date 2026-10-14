import type { Metadata } from "next";
import { getContent } from "@/content";
import { Services } from "@/components/pages/Services";

export const metadata: Metadata = {
  title: "Services | Leen Al Sharq Holding",
  description: "IT & networking, tests & measurements, power systems, and tools.",
  alternates: { canonical: "/en/services", languages: { ar: "/services", en: "/en/services" } },
};

export default function Page() {
  return <Services content={getContent("en")} />;
}

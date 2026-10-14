import type { Metadata } from "next";
import { getContent } from "@/content";
import { Contact } from "@/components/pages/Contact";

export const metadata: Metadata = {
  title: "تواصل معنا | لين الشرق القابضة",
  description: "اتصال، واتساب، بريد إلكتروني، وموقع الشركة في الرياض، العليا.",
  alternates: { canonical: "/contact", languages: { ar: "/contact", en: "/en/contact" } },
};

export default function Page() {
  return <Contact content={getContent("ar")} />;
}

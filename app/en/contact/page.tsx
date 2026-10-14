import type { Metadata } from "next";
import { getContent } from "@/content";
import { Contact } from "@/components/pages/Contact";

export const metadata: Metadata = {
  title: "Contact | Leen Al Sharq Holding",
  description: "Call, WhatsApp, email, and our office in Riyadh, Al Olaya.",
  alternates: { canonical: "/en/contact", languages: { ar: "/contact", en: "/en/contact" } },
};

export default function Page() {
  return <Contact content={getContent("en")} />;
}

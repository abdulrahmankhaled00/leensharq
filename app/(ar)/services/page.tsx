import type { Metadata } from "next";
import { getContent } from "@/content";
import { Services } from "@/components/pages/Services";

export const metadata: Metadata = {
  title: "خدماتنا | لين الشرق القابضة",
  description: "تقنية المعلومات والشبكات، أجهزة الاختبار والقياس، أنظمة الطاقة، والأدوات.",
  alternates: { canonical: "/services", languages: { ar: "/services", en: "/en/services" } },
};

export default function Page() {
  return <Services content={getContent("ar")} />;
}

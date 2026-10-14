import type { Metadata } from "next";
import { getContent } from "@/content";
import { Home } from "@/components/pages/Home";

export const metadata: Metadata = {
  title: "لين الشرق القابضة | بنية تقنية وشبكية وأنظمة طاقة",
  description:
    "لين الشرق القابضة تورّد وتركّب بنية تقنية المعلومات والشبكات وأنظمة الطاقة وأجهزة القياس للمستشفيات والجامعات والجهات الحكومية في السعودية.",
  alternates: { canonical: "/", languages: { ar: "/", en: "/en" } },
  openGraph: { title: "لين الشرق القابضة", locale: "ar_SA", url: "/", type: "website" },
};

export default function Page() {
  return <Home content={getContent("ar")} />;
}

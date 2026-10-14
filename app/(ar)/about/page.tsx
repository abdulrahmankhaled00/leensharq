import type { Metadata } from "next";
import { getContent } from "@/content";
import { About } from "@/components/pages/About";

export const metadata: Metadata = {
  title: "من نحن | لين الشرق القابضة",
  description: "شركة قابضة مقرّها الرياض، تقوم على أربعة تخصصات: الشبكات، القياس، الطاقة، والأدوات.",
  alternates: { canonical: "/about", languages: { ar: "/about", en: "/en/about" } },
};

export default function Page() {
  return <About content={getContent("ar")} />;
}

import type { Metadata } from "next";
import { getContent } from "@/content";
import { Projects } from "@/components/pages/Projects";

export const metadata: Metadata = {
  title: "مشاريعنا | لين الشرق القابضة",
  description: "توريد وتركيب عبر مواقع صحية وتعليمية وفندقية وحكومية في المملكة العربية السعودية.",
  alternates: { canonical: "/projects", languages: { ar: "/projects", en: "/en/projects" } },
};

export default function Page() {
  return <Projects content={getContent("ar")} />;
}

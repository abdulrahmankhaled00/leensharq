import type { Metadata } from "next";
import { getContent } from "@/content";
import { Projects } from "@/components/pages/Projects";

export const metadata: Metadata = {
  title: "Projects | Leen Al Sharq Holding",
  description: "Supply and installation across healthcare, higher education, hospitality and government sites.",
  alternates: { canonical: "/en/projects", languages: { ar: "/projects", en: "/en/projects" } },
};

export default function Page() {
  return <Projects content={getContent("en")} />;
}

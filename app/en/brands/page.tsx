import type { Metadata } from "next";
import { getContent } from "@/content";
import { Brands } from "@/components/pages/Brands";

export const metadata: Metadata = {
  title: "Brands We Supply | Leen Al Sharq Holding",
  description: "Thirteen global manufacturers we supply, install and support.",
  alternates: { canonical: "/en/brands", languages: { ar: "/brands", en: "/en/brands" } },
};

export default function Page() {
  return <Brands content={getContent("en")} />;
}

import type { Metadata } from "next";
import { getContent } from "@/content";
import { Brands } from "@/components/pages/Brands";

export const metadata: Metadata = {
  title: "العلامات التجارية | لين الشرق القابضة",
  description: "ثلاث عشرة علامة عالمية نوفّرها ونركّبها وندعمها.",
  alternates: { canonical: "/brands", languages: { ar: "/brands", en: "/en/brands" } },
};

export default function Page() {
  return <Brands content={getContent("ar")} />;
}

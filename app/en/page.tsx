import type { Metadata } from "next";
import { getContent } from "@/content";
import { Home } from "@/components/pages/Home";

export const metadata: Metadata = {
  title: "Leen Al Sharq Holding | IT, Networking & Power Infrastructure",
  description:
    "Leen Al Sharq Holding supplies and installs IT, networking, power and test infrastructure for hospitals, universities and government institutions in Saudi Arabia.",
  alternates: { canonical: "/en", languages: { ar: "/", en: "/en" } },
  openGraph: { title: "Leen Al Sharq Holding", locale: "en_US", url: "/en", type: "website" },
};

export default function Page() {
  return <Home content={getContent("en")} />;
}

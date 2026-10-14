import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getContent } from "@/content";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const content = getContent("en");
  return (
    <>
      <Header content={content} />
      {children}
      <Footer content={content} />
    </>
  );
}

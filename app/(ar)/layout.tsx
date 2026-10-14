import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getContent } from "@/content";

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  const content = getContent("ar");
  return (
    <>
      <Header content={content} />
      {children}
      <Footer content={content} />
    </>
  );
}

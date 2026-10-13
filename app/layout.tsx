import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لين الشرق القابضة | Leen Al Sharq Holding",
  description: "الموقع الرسمي لشركة لين الشرق القابضة قيد الإنشاء — قريبًا.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

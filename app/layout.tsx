import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كاندي لوكيشن | Candy Location - المركز الرقمي وبوابة التجهيز",
  description: "المنصة التفاعلية لتوثيق وتحليل بيانات ومعلومات مشروع موقع وتطبيق Candy Location",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}


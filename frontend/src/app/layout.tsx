import type { Metadata } from "next";
import "./globals.css";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { getLang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "V-Museum Kutaisi",
  description: "Virtual museum of Kutaisi artifacts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={lang}>
      <body className="antialiased" suppressHydrationWarning>
        <div className="sticky top-0 z-50 flex justify-end border-b border-white/5 bg-neutral-950/80 px-6 py-2 backdrop-blur">
          <LanguageSwitcher lang={lang} />
        </div>
        {children}
      </body>
    </html>
  );
}

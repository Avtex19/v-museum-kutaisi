import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V-Museum Kutaisi",
  description: "Virtual museum of Kutaisi artifacts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
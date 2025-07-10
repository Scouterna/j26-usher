import type { Metadata } from "next";
import "./globals.css";
import "@scouterna/ui-react/dist/style.css";

export const metadata: Metadata = {
  title: "J26 Usher",
  description: "Application swither for Jamboree 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

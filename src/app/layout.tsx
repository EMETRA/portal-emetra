import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/client/AppShell/AppShell";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal Emetra",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "@/components/client/AppShell/AppShell";

const montserrat = localFont({
  src: [
    {
      path: "../theme/fonts/Montserrat-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../theme/fonts/Montserrat-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../theme/fonts/Montserrat-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../theme/fonts/Montserrat-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
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
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/server/molecules/NavBar";
import { Footer } from "@/components/server/molecules/Footer";

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
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

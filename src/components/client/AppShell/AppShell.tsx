"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/server/molecules/NavBar";
import { Footer } from "@/components/server/molecules/Footer";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isCasillero = pathname.startsWith("/casillero");

  if (isCasillero) {
    return (
      <>
        <NavBar />
        {children}
      </>
    );
  }

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CasilleroDashboardSidebar from "@/components/client/organisms/CasilleroDashboardSidebar/CasilleroDashboardSidebar";
import CasilleroDashboardTopbar from "@/components/client/molecules/CasilleroDashboardTopbar/CasilleroDashboardTopbar";
import { useCompanyAccess } from "@/lib/casillero/company";
import styles from "./CasilleroDashboardLayout.module.scss";
import { useCasilleroProfileStore } from "@/store/useCasilleroProfileStore";

type Props = {
  children: React.ReactNode;
};

export default function CasilleroDashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profile = useCasilleroProfileStore((state) => state.profile);
  const loadProfile = useCasilleroProfileStore((state) => state.load);
  useCompanyAccess();

  useEffect(() => {
    void loadProfile().catch(() => {});
  }, [loadProfile]);

  const person = profile?.person;
  const userName = person
    ? [person.firstName, person.secondName, person.firstLastName, person.secondLastName].filter(Boolean).join(" ")
    : "";

  return (
    <main className={styles.shell}>
      <header className={styles.brandHeader}>
        <Image src="/images/Emetra.png" alt="EMETRA" width={193} height={80} priority />
      </header>

      <CasilleroDashboardTopbar
        userName={userName}
        hasCompanyContext={profile?.availableContexts?.some((context) => context.type === "COMPANY") ?? false}
        sidebarOpen={sidebarOpen}
        onMenuClickAction={() => setSidebarOpen((open) => !open)}
      />

      <div className={styles.body}>
        <CasilleroDashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <section className={styles.content}>{children}</section>
      </div>
    </main>
  );
}

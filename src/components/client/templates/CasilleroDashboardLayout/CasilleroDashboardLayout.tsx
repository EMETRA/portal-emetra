"use client";

import { useState } from "react";
import Image from "next/image";
import CasilleroDashboardSidebar from "@/components/client/organisms/CasilleroDashboardSidebar/CasilleroDashboardSidebar";
import CasilleroDashboardTopbar from "@/components/client/molecules/CasilleroDashboardTopbar/CasilleroDashboardTopbar";
import styles from "./CasilleroDashboardLayout.module.scss";

const dummyUser = {
  name: "Daniel Esteban Morales Urizar",
};

type Props = {
  children: React.ReactNode;
};

export default function CasilleroDashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className={styles.shell}>
      <header className={styles.brandHeader}>
        <Image src="/images/Emetra.png" alt="EMETRA" width={193} height={80} priority />
      </header>

      <CasilleroDashboardTopbar
        userName={dummyUser.name}
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

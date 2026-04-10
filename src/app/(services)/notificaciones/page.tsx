"use client";

import React from "react";
import { NotificationsCard } from "@/components/organisms/index";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
export default function Page() {
  return (
    <div>
      <SectionTitle>Notificaciones</SectionTitle>
      <NotificationsCard />
    </div>
  );
}

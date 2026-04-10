"use client";

import React from "react";
import { ExpedientesCard } from "@/components/organisms/index";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";

export default function Page() {
  return (
    <div>
      <SectionTitle>Juzgado</SectionTitle>
      <ExpedientesCard />
    </div>
  );
}

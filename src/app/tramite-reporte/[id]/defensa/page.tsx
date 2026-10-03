"use client";

import { Suspense } from "react";
import { ViviDefense } from "@/components/client/organisms/ViviDefense";
import { useParams } from 'next/navigation';

export default function DefensaPage() {
  const params = useParams<{ id: string }>();
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ViviDefense caseId={params.id} />
    </Suspense>
  );
}



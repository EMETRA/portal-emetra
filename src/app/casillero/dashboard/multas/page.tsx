// src/app/casillero/dashboard/multas/page.tsx
import { Suspense } from "react";
import ConsultaMultasPage from "@/components/client/organisms/ConsultaMultasPage/ConsultaMultasPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function MultasPage() {
  return (
    <CasilleroDashboardLayout>
      <Suspense fallback={<p style={{ margin: "2rem 0", textAlign: "center" }}>Cargando...</p>}>
        <ConsultaMultasPage />
      </Suspense>
    </CasilleroDashboardLayout>
  );
}

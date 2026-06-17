// src/app/casillero/dashboard/multas/page.tsx
import ConsultaMultasPage from "@/components/client/organisms/ConsultaMultasPage/ConsultaMultasPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function MultasPage() {
    return (
        <CasilleroDashboardLayout>
            <ConsultaMultasPage />
        </CasilleroDashboardLayout>
    );
}
// src/app/casillero/dashboard/placas/page.tsx
import GestionPlacasPage from "@/components/client/organisms/GestionPlacasPage/GestionPlacasPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function PlacasPage() {
    return (
        <CasilleroDashboardLayout>
            <GestionPlacasPage />
        </CasilleroDashboardLayout>
    );
}
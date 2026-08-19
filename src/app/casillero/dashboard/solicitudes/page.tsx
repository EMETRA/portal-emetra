import SolicitudesPage from "@/components/client/organisms/SolicitudesPage/SolicitudesPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function Solicitudes() {
    return (
        <CasilleroDashboardLayout>
            <SolicitudesPage />
        </CasilleroDashboardLayout>
    );
}
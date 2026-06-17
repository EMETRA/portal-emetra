// src/app/casillero/dashboard/multas/[id]/page.tsx
import FineDetailPage from "@/components/client/organisms/FineDetailPage/FineDetailPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function MultaDetailPage({ params }: { params: { id: string } }) {
    return (
    <CasilleroDashboardLayout>
        <FineDetailPage fineId={params.id} />
    </CasilleroDashboardLayout>
    );
}
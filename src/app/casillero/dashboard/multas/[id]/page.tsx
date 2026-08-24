// src/app/casillero/dashboard/multas/[id]/page.tsx
import FineDetailPage from "@/components/client/organisms/FineDetailPage/FineDetailPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default async function MultaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <CasilleroDashboardLayout>
      <FineDetailPage fineId={id} />
    </CasilleroDashboardLayout>
  );
}

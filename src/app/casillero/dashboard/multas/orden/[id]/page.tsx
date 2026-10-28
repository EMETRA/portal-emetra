// src/app/casillero/dashboard/multas/orden/[id]/page.tsx
import EstadoOrdenPagoPage from "@/components/client/organisms/EstadoOrdenPagoPage/EstadoOrdenPagoPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default async function OrdenPagoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <CasilleroDashboardLayout>
      <EstadoOrdenPagoPage orderId={id} />
    </CasilleroDashboardLayout>
  );
}

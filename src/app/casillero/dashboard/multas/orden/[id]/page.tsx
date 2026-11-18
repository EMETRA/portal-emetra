// src/app/casillero/dashboard/multas/orden/[id]/page.tsx
import EstadoOrdenPagoPage from "@/components/client/organisms/EstadoOrdenPagoPage/EstadoOrdenPagoPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default async function OrdenPagoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { id } = await params;
  const { attempt } = await searchParams;

  return (
    <CasilleroDashboardLayout>
      <EstadoOrdenPagoPage orderId={id} attemptId={attempt} />
    </CasilleroDashboardLayout>
  );
}

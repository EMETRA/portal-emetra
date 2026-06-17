import CasilleroDashboardHome from "@/components/client/organisms/CasilleroDashboardHome/CasilleroDashboardHome";
import ConsultaMultasPage from "@/components/client/organisms/ConsultaMultasPage/ConsultaMultasPage";
import FineDetailPage from "@/components/client/organisms/FineDetailPage/FineDetailPage";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function CasilleroDashboardPage() {
  return (
    <CasilleroDashboardLayout>
      {/* <CasilleroDashboardHome /> */}
      {/* <ConsultaMultasPage /> */}
      <FineDetailPage />
    </CasilleroDashboardLayout> 
  );
}

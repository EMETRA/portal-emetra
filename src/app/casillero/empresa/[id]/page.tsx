import CasilleroCompanyDetail from "@/components/client/organisms/CasilleroCompany/CasilleroCompanyDetail";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CasilleroDashboardLayout><CasilleroCompanyDetail companyId={id} /></CasilleroDashboardLayout>;
}

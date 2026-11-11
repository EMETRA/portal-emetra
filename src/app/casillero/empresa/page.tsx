import CasilleroCompanySummary from "@/components/client/organisms/CasilleroCompany/CasilleroCompanySummary";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function CompanyPage() {
    return (
        <CasilleroDashboardLayout>
            <CasilleroCompanySummary />
        </CasilleroDashboardLayout>
    );
}

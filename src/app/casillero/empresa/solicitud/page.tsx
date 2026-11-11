import CasilleroCompanyRequest from "@/components/client/organisms/CasilleroCompany/CasilleroCompanyRequest";
import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";

export default function CompanyRequestPage() {
    return (
        <CasilleroDashboardLayout>
            <CasilleroCompanyRequest />
        </CasilleroDashboardLayout>
    );
}

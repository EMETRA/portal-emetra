import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";
import CasilleroEmployeeManagement from "@/components/client/organisms/CasilleroEmployeeManagement/CasilleroEmployeeManagement";

export default function CasilleroEmployeeManagementPage() {
  return (
    <CasilleroDashboardLayout>
      <CasilleroEmployeeManagement />
    </CasilleroDashboardLayout> 
  );
}

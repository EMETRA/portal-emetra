import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";
import UserProfilePage from "@/components/client/organisms/CasilleroUserProfile/CasilleroUserProfile";

export default function CasilleroUserProfilePage() {
  return (
    <CasilleroDashboardLayout>
      <UserProfilePage />
    </CasilleroDashboardLayout> 
  );
}

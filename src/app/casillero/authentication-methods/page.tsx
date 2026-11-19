import CasilleroDashboardLayout from "@/components/client/templates/CasilleroDashboardLayout/CasilleroDashboardLayout";
import CasilleroAuthenticationMethods from "@/components/client/organisms/CasilleroAuthenticationMethods/CasilleroAuthenticationMethods";

export default function AuthenticationMethodsPage() {
  return (
    <CasilleroDashboardLayout>
      <CasilleroAuthenticationMethods />
    </CasilleroDashboardLayout>
  );
}

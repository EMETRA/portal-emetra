import { Suspense } from "react";
import AuthPageClient from "./AuthPageClient";

export default function AuthPage() {
  return (
    <Suspense fallback={<p style={{ margin: "4rem auto", textAlign: "center" }}>Cargando...</p>}>
      <AuthPageClient />
    </Suspense>
  );
}

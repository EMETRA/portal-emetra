"use client";

import { useSearchParams } from "next/navigation";
import AuthForm from "./AuthForm";

export default function AuthPageClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/";

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "4rem auto",
        padding: "1.25rem",
        border: "1px solid #d9d9d9",
        borderRadius: 8,
      }}
    >
      <h1 style={{ marginTop: 0 }}>Acceso autorizado</h1>
      <p>Ingresa el token para continuar.</p>
      <AuthForm redirectTo={redirectTo} />
    </main>
  );
}

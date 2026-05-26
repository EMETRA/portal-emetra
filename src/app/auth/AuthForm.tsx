"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  redirectTo: string;
};

export default function AuthForm({ redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "No se pudo validar la autorizacion");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Error de conexion al validar autorizacion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="token">Token</label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          style={{ width: "100%", margin: "0.5rem 0 0.75rem", padding: "0.5rem" }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Validando..." : "Ingresar"}
        </button>
      </form>
      {error && (
        <p role="alert" style={{ color: "#a8071a", marginTop: "0.75rem" }}>
          {error}
        </p>
      )}
    </>
  );
}

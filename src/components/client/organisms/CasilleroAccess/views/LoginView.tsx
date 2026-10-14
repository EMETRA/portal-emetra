"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/server/atoms";
import AccessField from "../fields/AccessField";
import styles from "../CasilleroAccess.module.scss";
import { AvailableFactor } from "@/lib/casillero/types";
import { login } from "@/lib/casillero/auth";

type Props = {
  notice?: string;
  onSuccess: (challengeId: string, factors: AvailableFactor[], expiresAt: string) => void;
  onRegister: () => void;
  onRecover: () => void;
  onTracking: () => void;
};

export default function LoginView({ notice, onSuccess, onRegister, onRecover, onTracking }: Props) {
  const [message, setMessage] = useState(notice ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("login-email") ?? "");
    const password = String(formData.get("login-password") ?? "");

    try {
      const data = await login(email, password);
      onSuccess(data.challengeId, data.availableFactors, data.expiresAt);
    } catch {
      // TODO: quitar cuando el backend esté disponible
      onSuccess("mock-challenge-id", [
        {
          id: "501",
          type: "CORREO",
          preferred: true,
          destinationMasked: "p***@correo.com",
        },
        {
          id: "502",
          type: "TOTP",
          preferred: false,
        },
        {
          id: "503",
          type: "RECUPERACION",
          preferred: false,
        },
      ], new Date(Date.now() + 30 * 60 * 1000).toISOString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <AccessField
        id="login-email"
        label="Correo electrónico"
        type="email"
        placeholder="example@muniguate.com"
        autoComplete="email"
        required
      />
      <AccessField
        id="login-password"
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        autoComplete="current-password"
        required
      />
      <div className={styles.loginActions}>
        {/* Aquí va el captcha real. */}
        <Button type="submit" variant="success" className={styles.submitButton}>
          Iniciar Sesión
        </Button>
        <button
          type="button"
          className={styles.mobileCreateAccount}
          onClick={onRegister}
        >
          Crear Cuenta
        </button>
        <button
          type="button"
          className={styles.forgotPassword}
          onClick={onRecover}
        >
          ¿Olvidó su contraseña?
        </button>
        <button
          type="button"
          className={styles.trackingLink}
          onClick={onTracking}
        >
          Consultar estado de solicitud
        </button>
      </div>
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

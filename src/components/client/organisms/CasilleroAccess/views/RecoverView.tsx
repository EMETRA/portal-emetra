"use client";

import { FormEvent, useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/server/atoms";
import { passwordSchema } from "@/schema/casillero";
import { requestPasswordReset, resetPassword } from "@/lib/casillero/auth";
import { useSessionStore } from "@/store/useSessionStore";
import AccessField from "../fields/AccessField";
import type { RecoverStep } from "../types";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  onLogin: (message?: string) => void;
};

const submitLabel: Record<RecoverStep, string> = {
  email: "Enviar código",
  code: "Restablecer",
};

const SOLICITUD_ACEPTADA =
  "Si el correo está registrado, te enviamos un token de recuperación. Revisa tu bandeja de entrada y la carpeta de Spam, y copia el token aquí.";
const CONTRASENA_RESTABLECIDA =
  "Contraseña restablecida. Por seguridad se cerraron las sesiones abiertas. Inicia sesión con tu nueva contraseña.";

export default function RecoverView({ onLogin }: Props) {
  const clearSession = useSessionStore((state) => state.clearSession);
  const [step, setStep] = useState<RecoverStep>("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const volverAPedirToken = () => {
    setMessage("");
    setStep("email");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    if (step === "email") {
      const email = String(formData.get("recovery-email") ?? "").trim();

      try {
        // El backend acepta igual exista o no la cuenta; solo falla si la solicitud falla.
        await requestPasswordReset(email);
        setStep("code");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "No se pudo enviar la solicitud. Intenta más tarde");
      } finally {
        setLoading(false);
      }
      return;
    }

    // step === "code" — token + nueva contraseña
    const token = String(formData.get("recovery-token") ?? "").trim();
    const password = String(formData.get("recovery-password") ?? "");
    const confirmPassword = String(formData.get("recovery-confirm-password") ?? "");

    try {
      await passwordSchema.validate(password);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setMessage(err.message);
        setLoading(false);
        return;
      }
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      // El backend revoca las sesiones anteriores y el BFF borra la cookie de este navegador.
      clearSession();
      onLogin(CONTRASENA_RESTABLECIDA);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form key={step} className={styles.recoveryForm} onSubmit={handleSubmit}>
      {step === "email" && (
        <AccessField
          id="recovery-email"
          label="Correo electrónico"
          type="email"
          placeholder="example@muniguate.com"
          autoComplete="email"
          required
        />
      )}

      {step === "code" && (
        <>
          <p className={styles.recoveryIntro}>{SOLICITUD_ACEPTADA}</p>
          <AccessField
            id="recovery-token"
            label="Token de recuperación"
            type="text"
            placeholder="3YgTQ-SecureOpaqueRecoveryToken"
            autoComplete="off"
            required
          />
          <button
            type="button"
            className={`${styles.forgotPassword} ${styles.recoveryResend}`}
            onClick={volverAPedirToken}
            disabled={loading}
          >
            Pedir otro token
          </button>
          <AccessField
            id="recovery-password"
            label="Nueva contraseña"
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            autoComplete="new-password"
            required
          />
          <AccessField
            id="recovery-confirm-password"
            label="Confirmar contraseña"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            autoComplete="new-password"
            required
          />
        </>
      )}

      <div className={styles.recoveryActions}>
        <Button
          type="submit"
          variant="success"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Procesando..." : submitLabel[step]}
        </Button>
        <button
          type="button"
          className={styles.forgotPassword}
          onClick={() => onLogin()}
        >
          Iniciar Sesión
        </button>
      </div>
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

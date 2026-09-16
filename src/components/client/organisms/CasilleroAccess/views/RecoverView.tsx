"use client";

import { FormEvent, useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/server/atoms";
import { passwordSchema } from "@/schema/casillero";
import { requestPasswordReset, resetPassword } from "@/lib/casillero/auth";
import AccessField from "../fields/AccessField";
import type { RecoverStep } from "../types";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  onLogin: (message?: string) => void;
};

const submitLabel: Record<RecoverStep, string> = {
  email: "Enviar código",
  code: "Reestablecer",
};

export default function RecoverView({ onLogin }: Props) {
  const [step, setStep] = useState<RecoverStep>("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    if (step === "email") {
      const email = String(formData.get("recovery-email") ?? "");

      try {
        await requestPasswordReset(email);
        // siempre avanza — el backend nunca revela si el email existe
        setStep("code");
      } catch {
        // igual avanza para no revelar si el email existe
        setStep("code");
      } finally {
        setLoading(false);
      }
      return;
    }

    // step === "code" — token + nueva contraseña
    const token = String(formData.get("recovery-token") ?? "");
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
      onLogin("Contraseña restablecida. Inicia sesión con tu nueva contraseña.");
    } catch (err: any) {
      setMessage(err.message ?? "Error al restablecer la contraseña.");
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
          <p className={styles.formMessage} style={{ color: "#666" }}>
            Revisa tu correo y copia el token que recibiste.
          </p>
          <AccessField
            id="recovery-token"
            label="Token de recuperación"
            type="text"
            placeholder="3YgTQ-SecureOpaqueRecoveryToken"
            autoComplete="off"
            required
          />
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
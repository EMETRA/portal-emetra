"use client";

import { FormEvent, useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/server/atoms";
import { passwordSchema } from "@/schema/casillero";
import AccessField from "../fields/AccessField";
import type { RecoverStep } from "../types";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  onLogin: (message?: string) => void;
};

const submitLabel: Record<RecoverStep, string> = {
  email: "Enviar código",
  code: "Validar",
  password: "Reestablecer",
};

export default function RecoverView({ onLogin }: Props) {
  const [step, setStep] = useState<RecoverStep>("email");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === "email") {
      setStep("code");
      setMessage("");
      return;
    }

    if (step === "code") {
      setStep("password");
      setMessage("");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("recovery-password") ?? "");
    const confirmPassword = String(formData.get("recovery-confirm-password") ?? "");

    try {
      await passwordSchema.validate(password);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setMessage(err.message);
        return;
      }
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    onLogin("La contraseña fue restablecida correctamente.");
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
        <AccessField
          id="recovery-code"
          label="Ingresar código"
          type="text"
          placeholder="8QGRH7T6"
          autoComplete="one-time-code"
          required
        />
      )}
      {step === "password" && (
        <>
          <AccessField
            id="recovery-password"
            label="Nueva Contraseña"
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            autoComplete="new-password"
            required
          />
          <AccessField
            id="recovery-confirm-password"
            label="Confirmar Contraseña"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            autoComplete="new-password"
            required
          />
        </>
      )}
      <div className={styles.recoveryActions}>
        <Button type="submit" variant="success" className={styles.submitButton}>
          {submitLabel[step]}
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

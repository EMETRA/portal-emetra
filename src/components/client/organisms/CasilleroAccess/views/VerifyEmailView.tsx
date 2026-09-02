"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Input } from "@/components/server/atoms";
import { Text } from "@/components/atoms";
import { verifyEmailSchema } from "@/schema/casillero-registro";
import { confirmContactVerification, requestContactVerification } from "@/lib/casillero/api";
import * as yup from "yup";
import styles from "../CasilleroAccess.module.scss";
import AccessField from "../fields/AccessField";

const RESEND_COOLDOWN_SECONDS = 60;

type Props = {
  email: string;
  verificationId: string;
  expiresAt: string;
  onSuccess: () => void;
  onResend: (newVerificationId: string, newExpiresAt: string) => void;
};

function secondsUntil(isoDate: string): number {
  const diffMs = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}

function formatMMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function VerifyEmailView({ email, verificationId, expiresAt, onSuccess, onResend, }: Props) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(expiresAt));

  useEffect(() => {
    setSecondsLeft(secondsUntil(expiresAt));
    const timer = setInterval(() => {
      setSecondsLeft(secondsUntil(expiresAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const isExpired = secondsLeft <= 0;
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isExpired) return;

    const formData = new FormData(event.currentTarget);
    const data = {
      code: String(formData.get("verify-email-code") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirm-password") ?? ""),
    };

    try {
      await verifyEmailSchema.validate(data, { abortEarly: true });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setMessage(error.message);
        return;
      }
    }

    setIsSubmitting(true);
    setMessage("");
    try {
      await confirmContactVerification(verificationId, data.code, data.password);
      onSuccess();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "El código de verificación es incorrecto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;
    setIsResending(true);
    setMessage("");
    try {
      const result = await requestContactVerification(email);
      onResend(result.verificationId, result.expiresAt);
      setMessage("Enviamos un nuevo código a tu correo.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo reenviar el código."
      );
      /// VERY IMPORTANT TO REMOVE: This is a temporary workaround to allow the user to proceed to the verification step even if the resend fails. This should be removed once the backend is fixed to return a proper verification ID on success.
      // onResend("1", "2026-09-02T19:07:22.382Z");
      // setMessage("Enviamos un nuevo código a tu correo.");
      // setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setIsResending(false);
    }
  };


  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.twoFactorIntro}>
        <Text>
          La autenticación en dos pasos es una capa adicional de protección para tu cuenta.
        </Text>
        <Text variant="Small">
          <strong>Nota:</strong> Recuerda revisar la carpeta de Spam
        </Text>
      </div>

      <label className={styles.field} htmlFor="verify-email-code">
        <span>Código de verificación</span>
        <Input
          id="verify-email-code"
          name="verify-email-code"
          type="text"
          placeholder="123456"
          autoComplete="verification-code"
          required
          disabled={isExpired}
          className={styles.input}
        />
      </label>

      <AccessField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        autoComplete="new-password"
        required
      />
      <AccessField
        id="confirm-password"
        label="Confirmar contraseña"
        type="password"
        placeholder="Confirma tu contraseña"
        autoComplete="new-password"
        required
      />

      <Text variant="Small" className={isExpired ? styles.timerExpired : styles.timer}>
        {isExpired
          ? "El código expiró, solicita uno nuevo."
          : `Expira en ${formatMMSS(secondsLeft)}`}
      </Text>

      <div className={styles.loginActions}>
        <Button
          type="submit"
          variant="success"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verificando..." : "Verificar"}
        </Button>
      </div>

      <button
        type="button"
        className={styles.resendLink}
        onClick={handleResend}
        disabled={isResending || resendCooldown > 0}
      >
        {isResending
          ? "Reenviando..."
          : resendCooldown > 0
            ? `¿No recibiste el correo? Reenviar en ${resendCooldown}s`
            : "¿No recibiste el correo? Reenviar código"}
      </button>

      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

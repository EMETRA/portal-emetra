"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@/components/server/atoms";
import { Text } from "@/components/atoms";
import { VerifyEmailCode } from "@/schema/casillero-registro";
import { confirmContactVerification } from "@/lib/casillero/api";
import * as yup from "yup";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  verificationId: string;
  onSuccess: () => void;
};

export default function VerifyEmailView({ verificationId, onSuccess }: Props) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("verify-email-code") ?? "").trim();

    try {
      await VerifyEmailCode.validate(code);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setMessage(error.message);
        return;
      }
    }

    setIsSubmitting(true);
    setMessage("");
    try {
      await confirmContactVerification(verificationId, code);
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
          className={styles.input}
        />
      </label>

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
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

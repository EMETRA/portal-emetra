"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@/components/server/atoms";
import { Text } from "@/components/atoms";
import { VerifyEmailCode } from "@/schema/casillero-registro";
import * as yup from "yup";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  verificationId: string;
  onSuccess: () => void;
};

export default function VerifyEmailView({ verificationId, onSuccess }: Props) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const code = formData.get("verify-email-code");

    try {
      await VerifyEmailCode.validate(code);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setMessage(error.message);
        return;
      }
    }

    try {
        //   await verifyEmail(verificationId, code);
        await new Promise((resolve) => setTimeout(() => Math.random() > 0.5 ? resolve(true) : resolve(false), 1000));

        onSuccess();
    } catch (error) {
      setMessage("El código de verificación es incorrecto.");
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
        <Button type="submit" variant="success" className={styles.submitButton}>
          Verificar
        </Button>
      </div>
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/server/atoms";
import AccessField from "../fields/AccessField";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  notice?: string;
  onSuccess: () => void;
  onRegister: () => void;
  onRecover: () => void;
};

export default function LoginView({ notice, onSuccess, onRegister, onRecover }: Props) {
  const [message, setMessage] = useState(notice ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    onSuccess();
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
      </div>
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

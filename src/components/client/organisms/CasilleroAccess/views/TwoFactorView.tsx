"use client";

import { FormEvent, useState } from "react";
import { Button, Icon, Input } from "@/components/server/atoms";
import { Text } from "@/components/atoms";
import { twoFactorMethods } from "../constants";
import type { TwoFactorMethod } from "../types";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  onSuccess: () => void;
};

export default function TwoFactorView({ onSuccess }: Props) {
  const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!twoFactorMethod) {
      setMessage("Selecciona un método de autenticación.");
      return;
    }

    onSuccess();
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

      <div className={styles.methodsRow} role="radiogroup" aria-label="Método de autenticación">
        {twoFactorMethods.map((method) => {
          const isSelected = twoFactorMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={method.label}
              className={isSelected ? `${styles.methodButton} ${styles.selected}` : styles.methodButton}
              onClick={() => {
                setTwoFactorMethod(method.id);
                setMessage("");
              }}
            >
              <Icon name={method.icon} className={styles.methodIcon} />
            </button>
          );
        })}
      </div>

      <label className={styles.field} htmlFor="two-factor-code">
        <span>Código</span>
        <Input
          id="two-factor-code"
          name="two-factor-code"
          type="text"
          placeholder="*****"
          autoComplete="one-time-code"
          required
          className={styles.input}
        />
      </label>

      <div className={styles.loginActions}>
        <Button type="submit" variant="success" className={styles.submitButton}>
          Iniciar Sesión
        </Button>
      </div>
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

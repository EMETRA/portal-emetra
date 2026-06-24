"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import SatTitle from "@/components/atoms/SatTitle/SatTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import styles from "./CasilleroChangePassword.module.scss";

type View = "email" | "code" | "password";

export default function CasilleroChangePassword() {
  const router = useRouter();
  const [view, setView] = useState<View>("email");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (view === "email") {
      setView("code");
      setError("");
      return;
    }

    if (view === "code") {
      setView("password");
      setError("");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("change-password") ?? "");
    const confirmPassword = String(formData.get("change-confirm-password") ?? "");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    alert("La contraseña fue cambiada correctamente.");

    router.push("/casillero/dashboard");
  };

  const renderFields = () => {
    if (view === "email") {
      return (
        <label className={styles.field} htmlFor="change-email">
          <span className={styles.label}>Correo electrónico</span>
          <Input
            id="change-email"
            name="change-email"
            type="email"
            placeholder="example@muniguate.com"
            autoComplete="email"
            required
            className={styles.input}
          />
        </label>
      );
    }

    if (view === "code") {
      return (
        <label className={styles.field} htmlFor="change-code">
          <span className={styles.label}>Ingresar código</span>
          <Input
            id="change-code"
            name="change-code"
            type="text"
            placeholder="8QGRH7T6"
            autoComplete="one-time-code"
            required
            className={styles.input}
          />
        </label>
      );
    }

    return (
      <>
        <label className={styles.field} htmlFor="change-password">
          <span className={styles.label}>Nueva Contraseña</span>
          <Input
            id="change-password"
            name="change-password"
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            autoComplete="new-password"
            required
            className={styles.input}
          />
        </label>
        <label className={styles.field} htmlFor="change-confirm-password">
          <span className={styles.label}>Confirmar Contraseña</span>
          <Input
            id="change-confirm-password"
            name="change-confirm-password"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            autoComplete="new-password"
            required
            className={styles.input}
          />
        </label>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <SatTitle uppercase={false}>Cambiar contraseña</SatTitle>

      <CardGeneral className={styles.card} padding="lg">
        <h2 className={styles.title}>Cambiar contraseña</h2>
        <form key={view} className={styles.form} onSubmit={handleSubmit}>
          {renderFields()}

          <div className={styles.actions}>
            <Button type="submit" variant="success" className={styles.submitButton}>
              {view === "email"
                ? "Enviar código"
                : view === "code"
                  ? "Validar"
                  : "Reestablecer"}
            </Button>
          </div>

          {error && <p role="alert" className={styles.formMessage}>{error}</p>}
        </form>
      </CardGeneral>
    </div>
  );
}

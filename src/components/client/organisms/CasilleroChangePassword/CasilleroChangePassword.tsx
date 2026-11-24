"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import { passwordSchema } from "@/schema/casillero";
import { requestPasswordReset, resetPassword } from "@/lib/casillero/auth";
import styles from "./CasilleroChangePassword.module.scss";

type View = "email" | "code" | "password";

export default function CasilleroChangePassword() {
  const router = useRouter();
  const [view, setView] = useState<View>("email");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (view === "email") {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("change-email") ?? "").trim();
      setIsSubmitting(true);
      setError("");
      try {
        await requestPasswordReset(email);
        setView("code");
      } catch (error) {
        setError(error instanceof Error ? error.message : "No se pudo enviar el código.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (view === "code") {
      const formData = new FormData(event.currentTarget);
      const token = String(formData.get("change-code") ?? "").trim();
      if (!token) {
        setError("Ingresa el código que recibiste por correo.");
        return;
      }
      setResetToken(token);
      setView("password");
      setError("");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("change-password") ?? "");
    const confirmPassword = String(formData.get("change-confirm-password") ?? "");

    try {
      await passwordSchema.validate(password);
    } catch (error) {
      setError((error as Error).message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await resetPassword(resetToken, password);
      router.push("/casillero/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo cambiar la contraseña.");
    } finally {
      setIsSubmitting(false);
    }
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
      <SectionTitle>Cambiar contraseña</SectionTitle>

      <CardGeneral className={styles.card} padding="lg">
        <h2 className={styles.title}>Cambiar contraseña</h2>
        <form key={view} className={styles.form} onSubmit={handleSubmit}>
          {renderFields()}

          <div className={styles.actions}>
            <Button type="submit" variant="success" className={styles.submitButton} disabled={isSubmitting}>
              {view === "email"
                ? isSubmitting ? "Enviando..." : "Enviar código"
                : view === "code"
                  ? "Continuar"
                  : isSubmitting ? "Restableciendo..." : "Restablecer"}
            </Button>
          </div>

          {error && <p role="alert" className={styles.formMessage}>{error}</p>}
        </form>
      </CardGeneral>
    </div>
  );
}

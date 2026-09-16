"use client";

import { FormEvent, useState } from "react";
import { Button, Icon, Input } from "@/components/server/atoms";
import { Text } from "@/components/atoms";
import { verifyChallenge, resendChallenge } from "@/lib/casillero/auth";
import { twoFactorMethods } from "../constants";
import type { AvailableFactor } from "@/lib/casillero/types";
import styles from "../CasilleroAccess.module.scss";
import { useSessionStore } from "@/store/useSessionStore";

type Props = {
  challengeId: string;
  availableFactors: AvailableFactor[];
  expiresAt: string;
  onSuccess: () => void;
};

export default function TwoFactorView({ challengeId, availableFactors, expiresAt, onSuccess }: Props) {
  const { setSession } = useSessionStore();

  // selecciona el preferido por defecto
  const defaultFactor = availableFactors.find((f) => f.preferred) ?? availableFactors[0];
  const [selectedFactor, setSelectedFactor] = useState<AvailableFactor | null>(defaultFactor ?? null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  // filtra los iconos del constants para mostrar solo los que el API devuelve
  const visibleMethods = twoFactorMethods.filter((m) =>
    availableFactors.some((f) => f.type === m.id)
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFactor) {
      setMessage("Selecciona un método de autenticación.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("two-factor-code") ?? "").trim();

    if (!code) {
      setMessage("Ingresa el código.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await verifyChallenge(challengeId, selectedFactor.type, code);
      setSession(data.sessionToken, data.expiresAt);
      onSuccess();
    } catch (err: any) {
      setMessage(err.message ?? "Código inválido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage("");
    try {
      const data = await resendChallenge(challengeId);
      setMessage(`Código reenviado a ${data.destinationMasked}`);
    } catch (err: any) {
      setMessage(err.message ?? "Error al reenviar el código.");
    } finally {
      setResendLoading(false);
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
        <Text variant="Small">
          El código expira a las {" "}
          <strong>
            {new Date(expiresAt).toLocaleTimeString("es-GT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </Text>
      </div>

      {/* destino enmascarado si es CORREO */}
      {selectedFactor?.type === "CORREO" && selectedFactor.destinationMasked && (
        <Text variant="Small">
          Código enviado a <strong>{selectedFactor.destinationMasked}</strong>
        </Text>
      )}
      <div className={styles.methodsRow} role="radiogroup" aria-label="Método de autenticación">
        {visibleMethods.map((method) => {
          const factor = availableFactors.find((f) => f.type === method.id);
          const isSelected = selectedFactor?.type === method.id;

          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={method.label}
              className={isSelected ? `${styles.methodButton} ${styles.selected}` : styles.methodButton}
              onClick={() => {
                if (factor) {
                  setSelectedFactor(factor);
                  setMessage("");
                }
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
        <Button
          type="submit"
          variant="success"
          className={styles.submitButton}
          disabled={loading || !selectedFactor}
        >
          {loading ? "Verificando..." : "Iniciar Sesión"}
        </Button>

        {selectedFactor?.type === "CORREO" && (
          <button
            type="button"
            className={styles.forgotPassword}
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? "Reenviando..." : "¿No recibiste el código? Reenviar"}
          </button>
        )}
      </div>

      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}
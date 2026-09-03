"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import Text from "@/components/atoms/Text/Text";
import { Button, Input } from "@/components/server/atoms";
import { CasilleroPopUp } from "@/components/client/molecules/CasilleroPopUp/CasilleroPopUp";
import styles from "./CasilleroDeleteAccount.module.scss";

const confirmationMessage = "Eliminar mi cuenta";

export default function CasilleroDeleteAccount() {
  const [confirmMessage, setConfirmMessage] = useState("");
  const [password, setPassword] = useState("");

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpVariant, setPopUpVariant] = useState<"success" | "error" | "warning">("success");

  const handleDeleteAccount = () => {
    if (confirmMessage.toLowerCase() !== confirmationMessage.toLowerCase()) {
      alert("El mensaje de confirmación no es correcto.");
      return;
    }

    if (password === "") {
      alert("La contraseña no puede estar vacía.");
      return;
    }

    setPopUpVariant("success");
    setIsPopUpOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <SectionTitle>Darme de baja</SectionTitle>

      <CardGeneral className={styles.card} padding="lg">
        <div className={styles.layout}>
          <div className={styles.description}>
            <Text className={styles.descriptionText}>
              Al darte de baja tu cuenta será eliminada, por lo que perderás acceso a tu cuenta y a todas las funcionalidades del
              <strong>
                {" Casillero electrónico"}
              </strong>
              .
              <br />
              Esta acción es
              <strong>
                {" irreversible"}
              </strong>
              .
            </Text>
          </div>

          <label className={styles.field} htmlFor="confirm-message">
            <span className={styles.label}>Para confirmar el cierre de tu cuenta escribe “{confirmationMessage}”.</span>
            <Input
              className={styles.input}
              id="confirm-message"
              type="text"
              value={confirmMessage}
              placeholder={confirmationMessage}
              onChange={(event) => setConfirmMessage(event.target.value)}
              required
            />
          </label>

          <label className={styles.field} htmlFor="password">
            <span className={styles.label}>Escribe tu contraseña</span>
            <Input
              className={styles.input}
              id="password"
              type="password"
              value={password}
              placeholder="Ingresa tu contraseña"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <Button
            type="button"
            variant="danger"
            className={styles.deleteBtn}
            onClick={handleDeleteAccount}
          >
            Darme de baja
          </Button>
        </div>
      </CardGeneral>
      <CasilleroPopUp
        isOpen={isPopUpOpen}
        variant={popUpVariant}
        title="Cuenta eliminada"
        description="Tu cuenta ha sido eliminada correctamente."
        onClose={() => setIsPopUpOpen(false)}
      />
    </div>
  );
}

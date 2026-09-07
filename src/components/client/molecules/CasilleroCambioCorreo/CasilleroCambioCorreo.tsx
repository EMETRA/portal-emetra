import React, { useState } from "react";
import * as yup from "yup";
import { CasilleroCambioCorreoProps } from "./types";
import { Button, Icon, Input } from "@/components/server/atoms";
import { PopOver } from "../../atoms/PopOver";
import { Text } from "@/components/atoms/Text";
import { CasilleroPopUp } from "@/components/client/molecules/CasilleroPopUp/CasilleroPopUp";
import styles from "./CasilleroCambioCorreo.module.scss";
import {
  completeEmailChangeSchema,
  editEmailSchema,
} from "./editEmail.schema";
// import {
//   completeEmailChange,
//   requestEmailChange,
// } from "@/lib/casillero/api";
import type { CasilleroEmailChangeCreated } from "@/lib/casillero/types";

export const CasilleroCambioCorreo = ({
  isOpen,
  onClose,
  onCompleted,
}: CasilleroCambioCorreoProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState<CasilleroEmailChangeCreated | null>(
    null
  );
  const [blockCloseOpen, setBlockCloseOpen] = useState(false);

  const isCodesStep = Boolean(request);

  const resetState = () => {
    setMessage(null);
    setRequest(null);
    setBlockCloseOpen(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const interceptClose = () => {
    if (isCodesStep) {
      setBlockCloseOpen(true);
      return;
    }
    handleClose();
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const newEmail = String(formData.get("newEmail") ?? "").trim();

    try {
      await editEmailSchema.validate({ newEmail }, { abortEarly: true });
    } catch (error) {
      setMessage(
        error instanceof yup.ValidationError
          ? error.message
          : "Revisa los campos del formulario."
      );
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    const created: CasilleroEmailChangeCreated = {
      requestId: "req_dummy_001",
      status: "PENDING_EMAIL_VERIFICATION",
      verificationId: "ver_dummy_001",
      verificationExpiresAt: "2026-12-31T23:59:59.000Z",
      currentEmailMasked: "daniel.morales@muniguate.com",
      newEmailMasked: newEmail,
      stepUpRequired: true,
      sessionPolicyOnCompletion: "KEEP",
      nextSteps: ["VERIFY_NEW_EMAIL", "COMPLETE_STEP_UP_2FA"],
      setUpChallengeId: "chal_dummy_001",
    };
    setRequest(created);
    setIsSubmitting(false);

    // try {
    //   const created = await requestEmailChange(newEmail);
    //   setRequest(created);
    // } catch (error) {
    //   setMessage(
    //     error instanceof Error
    //       ? error.message
    //       : "No se pudo solicitar el cambio de correo."
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleCodesSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !request) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const stepUpCode = String(formData.get("stepUpCode") ?? "").trim();
    const newEmailCode = String(formData.get("newEmailCode") ?? "").trim();

    try {
      await completeEmailChangeSchema.validate(
        { stepUpCode, newEmailCode },
        { abortEarly: true }
      );
    } catch (error) {
      setMessage(
        error instanceof yup.ValidationError
          ? error.message
          : "Revisa los códigos ingresados."
      );
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    resetState();
    onCompleted?.();
    onClose();
    setIsSubmitting(false);

    // try {
    //   await completeEmailChange(request.requestId, {
    //     verificationId: request.verificationId,
    //     newEmailCode,
    //     setUpChallengeId: request.setUpChallengeId ?? "",
    //     stepUpCode,
    //   });
    //   resetState();
    //   onCompleted?.();
    //   onClose();
    // } catch (error) {
    //   setMessage(
    //     error instanceof Error
    //       ? error.message
    //       : "No se pudieron validar los códigos."
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <>
      <PopOver isOpen={isOpen} onClose={interceptClose} position="center">
        {request ? (
          <form
            key="email-change-codes"
            className={styles.modalCard}
            autoComplete="off"
            onSubmit={(event) => void handleCodesSubmit(event)}
          >
            <div className={styles.header}>
              <div className={styles.detailsWrapper}>
                <h2 className={styles.title}>Verificar cambio de correo</h2>
              </div>
              <Icon
                name="Cross"
                width={24}
                height={24}
                className={styles.mainIcon}
                onClick={interceptClose}
              />
            </div>
            <Text variant="Large">Ingresa los códigos que te enviamos</Text>
            <Text variant="Small">
              Enviamos un código a tu correo actual ({request.currentEmailMasked})
              y otro a tu correo nuevo ({request.newEmailMasked}).
            </Text>
            <label className={styles.inputLabel} htmlFor="stepUpCode">
              <span>Código del correo actual</span>
              <Input
                key="step-up-code"
                id="stepUpCode"
                name="stepUpCode"
                type="text"
                className={styles.input}
                placeholder="******"
                autoComplete="off"
                defaultValue=""
                required
              />
            </label>
            <label className={styles.inputLabel} htmlFor="newEmailCode">
              <span>Código del correo nuevo</span>
              <Input
                key="new-email-code"
                id="newEmailCode"
                name="newEmailCode"
                type="text"
                className={styles.input}
                placeholder="******"
                autoComplete="off"
                defaultValue=""
                required
              />
            </label>
            {message && (
              <Text variant="Small" className={styles.errorMessage}>
                {message}
              </Text>
            )}
            <Button
              variant="success"
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Validando..." : "Completar cambio"}
            </Button>
          </form>
        ) : (
          <form
            key="email-change-request"
            className={styles.modalCard}
            onSubmit={(event) => void handleEmailSubmit(event)}
          >
            <div className={styles.header}>
              <div className={styles.detailsWrapper}>
                <h2 className={styles.title}>Cambiar correo electrónico</h2>
              </div>
              <Icon
                name="Cross"
                width={24}
                height={24}
                className={styles.mainIcon}
                onClick={interceptClose}
              />
            </div>
            <Text variant="Large">Ingresa tu nuevo correo electrónico</Text>
            <Text variant="Small">
              Este correo electrónico será el nuevo correo electrónico de tu
              cuenta. Te notificaremos cuando el cambio de correo electrónico sea
              exitoso.
            </Text>
            <label className={styles.inputLabel} htmlFor="newEmail">
              <span>Correo electrónico</span>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                className={styles.input}
                placeholder="example@muniguate.com"
                required
              />
            </label>
            {message && (
              <Text variant="Small" className={styles.errorMessage}>
                {message}
              </Text>
            )}
            <Button
              variant="success"
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Cambiar correo electrónico"}
            </Button>
          </form>
        )}
      </PopOver>
      <CasilleroPopUp
        isOpen={blockCloseOpen}
        variant="success"
        title="Completa el proceso"
        description="Debes ingresar ambos códigos recibidos en tu correo viejo y nuevo para completar el proceso de cambio de correo. Si no lo haces, no podrás completar el proceso."
        onClose={() => setBlockCloseOpen(false)}
      />
    </>
  );
};

export default CasilleroCambioCorreo;

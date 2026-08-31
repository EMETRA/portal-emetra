"use client";

import { FormEvent, useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/server/atoms";
import CasilleroPersonTypeSelector from "@/components/client/molecules/CasilleroPersonTypeSelector/CasilleroPersonTypeSelector";
import { registroIndividualSchema, registroLegalSchema } from "@/schema/casillero-registro";
import { requestContactVerification } from "@/lib/casillero/api";
import IndividualRegisterFields from "../fields/IndividualRegisterFields";
import LegalRegisterFields from "../fields/LegalRegisterFields";
import type { PersonType } from "../types";
import styles from "../CasilleroAccess.module.scss";

type Props = {
  onLogin: () => void;
  onSuccess: (verificationId: string) => void;
};

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export default function RegisterView({ onLogin, onSuccess }: Props) {
  const [personType, setPersonType] = useState<PersonType>("individual");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changePersonType = (nextType: PersonType) => {
    setPersonType(nextType);
    setMessage("");
  };

  const requestVerification = async (email: string) => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const result = await requestContactVerification(email);
      onSuccess(result.verificationId);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el código de verificación."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(event.currentTarget);

    if (personType === "individual") {
      const data = {
        firstName: formValue(formData, "firstName"),
        secondName: formValue(formData, "secondName"),
        firstLastName: formValue(formData, "firstLastName"),
        secondLastName: formValue(formData, "secondLastName"),
        email: formValue(formData, "email"),
        confirmEmail: formValue(formData, "confirm-email"),
        password: formValue(formData, "password"),
        confirmPassword: formValue(formData, "confirm-password"),
        dateOfBirth: formValue(formData, "dateOfBirth"),
        nationality: formValue(formData, "nationality"),
        residenceCountry: formValue(formData, "residenceCountry"),
        documentNumber: formValue(formData, "dpi"),
        documentCountry: formValue(formData, "documentCountry"),
        documentIssuedOn: formValue(formData, "documentIssuedOn"),
        documentExpiresOn: formValue(formData, "documentExpiresOn"),
      };

      try {
        await registroIndividualSchema.validate(data, { abortEarly: true });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          setMessage(err.message);
          return;
        }
      }

      const documentFile = formData.get("documentFile") as File | null;
      if (!documentFile || documentFile.size === 0) {
        setMessage("Debes adjuntar el archivo de tu DPI.");
        return;
      }

      await requestVerification(data.email);
      return;
    }

    const legalData = {
      dpi: formValue(formData, "dpi"),
      nit: formValue(formData, "nit"),
      email: formValue(formData, "email"),
      confirmEmail: formValue(formData, "confirm-email"),
      password: formValue(formData, "password"),
      confirmPassword: formValue(formData, "confirm-password"),
      rtuLink: formValue(formData, "rtu-link").trim(),
      mandateLink: formValue(formData, "legal-mandate-link").trim(),
    };

    try {
      await registroLegalSchema.validate(legalData, { abortEarly: true });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setMessage(err.message);
        return;
      }
    }

    await requestVerification(legalData.email);
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit}>
      <CasilleroPersonTypeSelector
        value={personType}
        onChange={changePersonType}
      />

      {personType === "individual" ? (
        <IndividualRegisterFields onFileTooLarge={setMessage} />
      ) : (
        <LegalRegisterFields />
      )}

      <label className={styles.terms}>
        <input type="checkbox" required />
        <span>
          Declaro que la información proporcionada es verídica y acepto la
          responsabilidad legal sobre los datos registrados.
        </span>
      </label>
      <Button
        type="submit"
        variant="success"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando código..." : "Crear Cuenta"}
      </Button>
      <button
        type="button"
        className={styles.mobileLoginLink}
        onClick={onLogin}
      >
        ¿Ya tiene cuenta? Inicie Sesión
      </button>
      {message && <p className={styles.formMessage}>{message}</p>}
    </form>
  );
}

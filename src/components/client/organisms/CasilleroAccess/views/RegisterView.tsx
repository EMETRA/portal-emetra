"use client";

import { FormEvent, useRef, useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/server/atoms";
import CasilleroPersonTypeSelector from "@/components/client/molecules/CasilleroPersonTypeSelector/CasilleroPersonTypeSelector";
import { registroIndividualSchema } from "@/schema/casillero-registro";
import { createIdempotencyKey, createPersonalRegistration } from "@/lib/casillero/api";
import IndividualRegisterFields from "../fields/IndividualRegisterFields";
import type { PersonType } from "../types";
import styles from "../CasilleroAccess.module.scss";
import type { PersonalRegistrationCreated, PersonalRegistrationRequest } from "@/lib/casillero/types";

// Hardcoded terms and conditions version ID. This should be updated whenever the terms are updated.
const TERMS_VERSION_ID = "1";

type Props = {
  onLogin: () => void;
  onSuccess: (result: PersonalRegistrationCreated, email: string) => void;
};

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export default function RegisterView({ onLogin, onSuccess }: Props) {
  const [personType, setPersonType] = useState<PersonType>("individual");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);

  const changePersonType = (nextType: PersonType) => {
    setPersonType(nextType);
    setMessage("");
  };

  const submitPersonalRegistration = async (
    payload: PersonalRegistrationRequest,
    documentFile: File
  ) => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const fingerprint = JSON.stringify({ payload, file: [documentFile.name, documentFile.size, documentFile.lastModified] });
      if (attempt.current?.fingerprint !== fingerprint) {
        attempt.current = { fingerprint, key: createIdempotencyKey() };
      }
      const result = await createPersonalRegistration(payload, documentFile, attempt.current.key);
      onSuccess(result, payload.email);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudo crear la solicitud de registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(event.currentTarget);

    if (personType === "legal") {
      setMessage("Para registrar una empresa, crea primero tu cuenta personal y luego solicita el acceso empresarial desde el casillero.");
      return;
    }

    if (personType === "individual") {
      const data = {
        firstName: formValue(formData, "firstName"),
        secondName: formValue(formData, "secondName"),
        firstLastName: formValue(formData, "firstLastName"),
        secondLastName: formValue(formData, "secondLastName"),
        email: formValue(formData, "email"),
        confirmEmail: formValue(formData, "confirm-email"),
        nit: formValue(formData, "nit"),
        phone: formValue(formData, "phone"),
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
      if (documentFile.size > 10 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(documentFile.type)) {
        setMessage("Adjunta una imagen JPG, JPEG o PNG de hasta 10 MB.");
        return;
      }

      const payload: PersonalRegistrationRequest = {
        email: data.email,
        nit: data.nit,
        phone: data.phone,
        firstName: data.firstName,
        secondName: data.secondName || undefined,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName || undefined,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        residenceCountry: data.residenceCountry,
        document: {
          type: "DPI",
          number: data.documentNumber,
          country: data.documentCountry,
          issuedOn: data.documentIssuedOn,
          expiresOn: data.documentExpiresOn,
        },
        termsVersionId: TERMS_VERSION_ID,
      };

      await submitPersonalRegistration(payload, documentFile);
      return;
    }
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
        <p className={styles.formMessage}>Para registrar una empresa, crea primero tu cuenta personal. Después podrás solicitar el acceso empresarial desde el casillero.</p>
      )}

      {personType === "individual" && <label className={styles.terms}>
        <input type="checkbox" required />
        <span>
          Declaro que la información proporcionada es verídica y acepto la
          responsabilidad legal sobre los datos registrados.
        </span>
      </label>}
      <Button
        type="submit"
        variant="success"
        className={styles.submitButton}
        disabled={isSubmitting || personType === "legal"}
      >
        {isSubmitting ? "Creando solicitud..." : "Crear Cuenta"}
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

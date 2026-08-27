import { ChangeEvent } from "react";
import CountrySelect from "@/components/client/atoms/CountrySelect/CountrySelect";
import AccessField from "./AccessField";
import styles from "../CasilleroAccess.module.scss";

const MAX_DOCUMENT_FILE_BYTES = 10 * 1024 * 1024;

type Props = {
  onFileTooLarge: (message: string) => void;
};

export default function IndividualRegisterFields({ onFileTooLarge }: Props) {
  const handleDocumentFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > MAX_DOCUMENT_FILE_BYTES) {
      onFileTooLarge("El archivo no puede superar 10 MB.");
      event.target.value = "";
    }
  };

  return (
    <>
      <AccessField id="firstName" label="Nombre" type="text" placeholder="Ana" required />
      <AccessField id="secondName" label="Segundo nombre" type="text" placeholder="María" />
      <AccessField id="firstLastName" label="Primer apellido" type="text" placeholder="López" required />
      <AccessField id="secondLastName" label="Segundo apellido" type="text" placeholder="García" />
      <AccessField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="example@muniguate.com"
        autoComplete="email"
        required
      />
      <AccessField
        id="confirm-email"
        label="Confirmar correo electrónico"
        type="email"
        placeholder="example@muniguate.com"
        autoComplete="email"
        required
      />
      <AccessField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        autoComplete="new-password"
        required
      />
      <AccessField
        id="confirm-password"
        label="Confirmar contraseña"
        type="password"
        placeholder="Confirma tu contraseña"
        autoComplete="new-password"
        required
      />
      <AccessField id="dateOfBirth" label="Fecha de nacimiento" type="date" required />
      <AccessField id="nationality" label="Nacionalidad" required>
        <CountrySelect id="nationality" name="nationality" required className={styles.input} />
      </AccessField>
      <AccessField id="residenceCountry" label="País de residencia" required>
        <CountrySelect id="residenceCountry" name="residenceCountry" required className={styles.input} />
      </AccessField>
      <div className={`${styles.sectionDivider} ${styles.fullCol}`}>
        <span>Documento de identidad (DPI)</span>
      </div>
      <AccessField id="dpi" label="Número de DPI" type="text" placeholder="2546987850101" required />
      <AccessField id="documentCountry" label="País del documento" required>
        <CountrySelect id="documentCountry" name="documentCountry" required className={styles.input} />
      </AccessField>
      <AccessField id="documentIssuedOn" label="Fecha de emisión" type="date" required />
      <AccessField id="documentExpiresOn" label="Fecha de vencimiento" type="date" required />
      <AccessField
        id="documentFile"
        label="Archivo del DPI"
        hint="(PDF, JPG, PNG · máx. 10 MB)"
        fullCol
      >
        <input
          id="documentFile"
          name="documentFile"
          type="file"
          accept=".pdf,image/jpeg,image/png"
          required
          className={styles.fileInput}
          onChange={handleDocumentFileChange}
        />
      </AccessField>
    </>
  );
}

import styles from "./CasilleroFileField.module.scss";

type Props = {
  id: string;
  label: string;
  fileName: string;
  onChange: (fileName: string) => void;
};

export default function CasilleroFileField({ id, label, fileName, onChange }: Props) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <span className={styles.input}>
        <span>{fileName || "Seleccionar archivo"}</span>
        <strong>Adjuntar</strong>
        <input id={id} name={id} type="file" accept=".pdf,.png,.jpg,.jpeg" required onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")} />
      </span>
    </label>
  );
}

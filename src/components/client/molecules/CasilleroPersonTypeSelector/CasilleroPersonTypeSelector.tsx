import type { PersonType } from "@/components/client/organisms/CasilleroAccess/types";
import styles from "./CasilleroPersonTypeSelector.module.scss";

type Props = {
  value: PersonType;
  onChange: (value: PersonType) => void;
};

export default function CasilleroPersonTypeSelector({ value, onChange }: Props) {
  return (
    <div className={styles.container} role="radiogroup" aria-label="Tipo de persona">
      <button type="button" role="radio" aria-checked={value === "individual"} className={value === "individual" ? styles.active : styles.button} onClick={() => onChange("individual")}>
        Persona individual
      </button>
      <button type="button" role="radio" aria-checked={value === "legal"} className={value === "legal" ? styles.active : styles.button} onClick={() => onChange("legal")}>
        Persona jurídica
      </button>
    </div>
  );
}

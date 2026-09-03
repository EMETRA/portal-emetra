import { Input } from "@/components/server/atoms";
import styles from "./CasilleroDriveLinkField.module.scss";

type Props = {
  id: string;
  label: string;
  placeholder: string;
};

export default function CasilleroDriveLinkField({ id, label, placeholder }: Props) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <Input
        id={id}
        name={id}
        type="url"
        placeholder={placeholder}
        required
        className={styles.input}
      />
    </label>
  );
}

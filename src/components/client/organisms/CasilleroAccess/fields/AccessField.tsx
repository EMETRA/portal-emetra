import { ReactNode } from "react";
import { Input, type InputProps } from "@/components/server/atoms";
import styles from "../CasilleroAccess.module.scss";

type AccessFieldProps = Omit<InputProps, "id" | "name" | "className"> & {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  fullCol?: boolean;
  children?: ReactNode;
};

export default function AccessField({
  id,
  name,
  label,
  hint,
  fullCol,
  children,
  ...inputProps
}: AccessFieldProps) {
  return (
    <label className={fullCol ? `${styles.field} ${styles.fullCol}` : styles.field} htmlFor={id}>
      <span>
        {label}
        {hint ? <span className={styles.hint}> {hint}</span> : null}
      </span>
      {children ?? (
        <Input id={id} name={name ?? id} className={styles.input} {...inputProps} />
      )}
    </label>
  );
}

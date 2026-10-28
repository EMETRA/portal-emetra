import styles from "./InfoField.module.scss";

interface InfoFieldProps {
    label: string;
    /** Texto, o una marca de dato pendiente (PendienteApi). */
    value: React.ReactNode;
}

export default function InfoField({ label, value }: InfoFieldProps) {
    return (
        <div className={styles.field}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        </div>
    );
}
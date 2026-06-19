import { RecordStatus } from "@/types/historial";
import styles from "./StatusPill.module.scss";

const labels: Record<RecordStatus, string> = {
    activa: "Activa",
    inactiva: "Inactiva",
};

export default function StatusPill({ status }: { status: RecordStatus }) {
    return (
        <span className={`${styles.pill} ${styles[status]}`}>
        <span className={styles.dot} />
        {labels[status]}
        </span>
    );
}
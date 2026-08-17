import { RecordType } from "@/types/historial";
import styles from "./DocumentTypeBadge.module.scss";

const labels: Record<RecordType, string> = {
    recibo: "Recibo",
    solvencia: "Solvencia",
};

export default function DocumentTypeBadge({ type }: { type: RecordType }) {
    return (
        <span className={`${styles.badge} ${styles[type]}`}>
        {labels[type]}
        </span>
    );
}
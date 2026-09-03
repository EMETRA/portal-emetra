
import { HistoryRecord, RecordType } from "@/types/historial";
import styles from "./RecordCard.module.scss";
import StatusPill from "../../atoms/StatusPill/StatusPill";

const typeLabels: Record<RecordType, string> = {
    recibo: "Recibo",
    solvencia: "Solvencia",
};

interface RecordCardProps {
    record: HistoryRecord;
    onClick?: () => void;
}

export default function RecordCard({ record, onClick }: RecordCardProps) {
    return (
        <article className={styles.card} onClick={onClick} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
        >
        <div className={`${styles.typeHeader} ${styles[record.type]}`}>
            {typeLabels[record.type]}
        </div>

        <div className={styles.body}>
            <p className={styles.code}>{record.code}</p>
            <p className={styles.date}>{record.date}</p>
            <div className={styles.footer}>
            <span className={styles.amount}>Q{record.amount}</span>
            {record.status && <StatusPill status={record.status} />}
            </div>
        </div>
        </article>
    );
}
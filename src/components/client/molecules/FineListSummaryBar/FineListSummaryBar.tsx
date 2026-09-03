import styles from "./FineListSummaryBar.module.scss";

interface FineListSummaryBarProps {
    count: number;
    total: number;
}

export default function FineListSummaryBar({ count, total }: FineListSummaryBarProps) {
    return (
        <div className={styles.bar}>
        <span>{count} Multas totales</span>
        <span>Total: Q{total.toLocaleString("es-GT")}</span>
        </div>
    );
}
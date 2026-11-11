import styles from "./FineListSummaryBar.module.scss";
import { formatearQuetzales } from "@/lib/casillero/montos";

interface FineListSummaryBarProps {
    count: number;
    total: number;
}

export default function FineListSummaryBar({ count, total }: FineListSummaryBarProps) {
    return (
        <div className={styles.bar}>
        <span>{count} Multas totales</span>
        <span>Total: {formatearQuetzales(total)}</span>
        </div>
    );
}
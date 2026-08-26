import CategoryBadge from "@/components/client/atoms/CategoryBadge/CategoryBadge";
import { Fine } from "@/types/fines";
import styles from "./FinesSummaryCard.module.scss";

interface FinesSummaryCardProps {
    fines: Fine[];
    total: number;
}

export default function FinesSummaryCard({ fines, total }: FinesSummaryCardProps) {
    return (
        <div className={styles.card}>
        <h2 className={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Detalle de multas seleccionadas
        </h2>

        <div className={styles.tableHeader}>
            <span>Serie-Remisión</span>
            <span>Monto</span>
        </div>

        <div className={styles.finesList}>
            {fines.map((fine) => (
            <div key={fine.id} className={styles.fineRow}>
                <div className={styles.fineLeft}>
                <span className={styles.fineCode}>{fine.code}</span>
                <CategoryBadge category={fine.category} />
                </div>
                <span className={styles.fineAmount}>Q{fine.amount.toFixed(2)}</span>
            </div>
            ))}
        </div>

        <div className={styles.totalRow}>
            <span>Total a pagar</span>
            <span className={styles.totalAmount}>Q{total.toFixed(2)}</span>
        </div>
        </div>
    );
}
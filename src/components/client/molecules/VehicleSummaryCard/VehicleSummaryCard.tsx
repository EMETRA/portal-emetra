import Card from "@/components/atoms/card/Card";
import { FINE_CATEGORIES, FineCategory } from "@/types/fines";
import styles from "./VehicleSummaryCard.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";

interface VehicleSummaryCardProps {
    model: string;
    color: string;
    year: number;
    totalAmount: number;
    pendingCount: number;
    amountsByCategory: Record<FineCategory, number>;
}

export default function VehicleSummaryCard({
    model,
    color,
    year,
    totalAmount,
    pendingCount,
    amountsByCategory,
}: VehicleSummaryCardProps) {
    return (
        <CardGeneral className={styles.card}>
        <h2 className={styles.title}>{model}</h2>

        <p className={styles.subtitle}>
            {color} <span className={styles.dot}>•</span> {year}
        </p>

        <p className={styles.totals}>
            {pendingCount} Multas pendientes <span className={styles.dot}>•</span> Total Q
            {totalAmount.toLocaleString("es-GT")}
        </p>

        <div className={styles.breakdown}>
            {FINE_CATEGORIES.map(({ value, label }) => (
            <span key={value} className={styles.breakdownItem}>
                • {label}: Q{amountsByCategory[value] ?? 0}
            </span>
            ))}
        </div>
        </CardGeneral>
    );
}
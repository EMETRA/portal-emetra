// import Card from "@/components/atoms/card/Card";
import { FINE_CATEGORIES, FineCategory } from "@/types/fines";
import styles from "./VehicleSummaryCard.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";

interface VehicleSummaryCardProps {
    /** Placa completa; se usa de título mientras no venga el modelo. */
    plate?: string;
    model?: string;
    color?: string;
    year?: number;
    totalAmount: number;
    pendingCount: number;
    /** Sin categorías (la API no las mandó) no se muestra el desglose. */
    amountsByCategory?: Record<FineCategory, number>;
}

export default function VehicleSummaryCard({
    plate,
    model,
    color,
    year,
    totalAmount,
    pendingCount,
    amountsByCategory,
}: VehicleSummaryCardProps) {
    return (
        <CardGeneral className={styles.card}>
        <h2 className={styles.title}>
            {model ?? plate}
            {!model && <PendienteApi campo="modelo" />}
        </h2>

        {color && year ? (
            <p className={styles.subtitle}>
                {color} <span className={styles.dot}>•</span> {year}
            </p>
        ) : color || year ? (
            <p className={styles.subtitle}>
                {color ?? <PendienteApi campo="color" />} {year ?? <PendienteApi campo="año" />}
            </p>
        ) : (
            // Sin párrafo vacío: las marcas no ocupan espacio.
            <>
                <PendienteApi campo="color" />
                <PendienteApi campo="año" />
            </>
        )}

        <p className={styles.totals}>
            {pendingCount} Multas pendientes <span className={styles.dot}>•</span> Total Q
            {totalAmount.toLocaleString("es-GT")}
        </p>

        {amountsByCategory ? (
            <div className={styles.breakdown}>
                {FINE_CATEGORIES.map(({ value, label }) => (
                <span key={value} className={styles.breakdownItem}>
                    • {label}: Q{amountsByCategory[value] ?? 0}
                </span>
                ))}
            </div>
        ) : (
            <PendienteApi campo="categoría" />
        )}
        </CardGeneral>
    );
}

// import Card from "@/components/atoms/card/Card";
import { FINE_CATEGORIES, FineCategory } from "@/types/fines";
import styles from "./VehicleSummaryCard.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";

interface VehicleSummaryCardProps {
    model?: string;
    color?: string;
    year?: number;
    totalAmount: number;
    pendingCount: number;
    /** Sin categorías (la API no las mandó) el desglose queda con marcas de pendiente. */
    amountsByCategory?: Record<FineCategory, number>;
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
        <h2 className={styles.title}>
            {model ?? <PendienteApi campo="modelo" ejemplo={DATOS_DE_EJEMPLO.vehiculo.modelo} />}
        </h2>

        <p className={styles.subtitle}>
            {color ?? <PendienteApi campo="color" ejemplo={DATOS_DE_EJEMPLO.vehiculo.color} />}{" "}
            <span className={styles.dot}>•</span>{" "}
            {year ?? <PendienteApi campo="año" ejemplo={DATOS_DE_EJEMPLO.vehiculo.anio} />}
        </p>

        <p className={styles.totals}>
            {pendingCount} Multas pendientes <span className={styles.dot}>•</span> Total Q
            {totalAmount.toLocaleString("es-GT")}
        </p>

        <div className={styles.breakdown}>
            {FINE_CATEGORIES.map(({ value, label }) => (
            <span key={value} className={styles.breakdownItem}>
                • {label}:{" "}
                {amountsByCategory ? `Q${amountsByCategory[value] ?? 0}` : <PendienteApi campo="categoría" />}
            </span>
            ))}
        </div>
        </CardGeneral>
    );
}

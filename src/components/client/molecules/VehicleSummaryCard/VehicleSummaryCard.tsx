// import Card from "@/components/atoms/card/Card";
import styles from "./VehicleSummaryCard.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";
import { formatearQuetzales } from "@/lib/casillero/montos";

interface VehicleSummaryCardProps {
    /** Marca y modelo, p. ej. "Toyota Corolla" (GET /v1/vehicles/{reference}). */
    model?: string;
    color?: string;
    year?: number;
    totalAmount: number;
    pendingCount: number;
    /**
     * Total pendiente por tipo de cobro, con los tipos que traen los cobros (texto libre
     * de la API). Vacío = sin cobros pendientes: no se muestra el desglose.
     */
    amountsByCategory: { value: string; label: string; amount: number }[];
}

/**
 * Marca, modelo, color y año vienen de la API; si llegan vacíos se muestra el dato de
 * ejemplo del diseño, sin marca de pendiente.
 */
export default function VehicleSummaryCard({
    model,
    color,
    year,
    totalAmount,
    pendingCount,
    amountsByCategory,
}: VehicleSummaryCardProps) {
    const ejemplo = DATOS_DE_EJEMPLO.vehiculo;

    return (
        <CardGeneral className={styles.card}>
        <h2 className={styles.title}>{model || ejemplo.modelo}</h2>

        <p className={styles.subtitle}>
            {color || ejemplo.color} <span className={styles.dot}>•</span> {year ?? ejemplo.anio}
        </p>

        <p className={styles.totals}>
            {pendingCount} Multas pendientes <span className={styles.dot}>•</span> Total{" "}
            {formatearQuetzales(totalAmount)}
        </p>

        {amountsByCategory.length > 0 && (
        <div className={styles.breakdown}>
            {amountsByCategory.map(({ value, label, amount }) => (
            <span key={value} className={styles.breakdownItem}>
                • {label}: {formatearQuetzales(amount)}
            </span>
            ))}
        </div>
        )}
        </CardGeneral>
    );
}

"use client";

import CategoryBadge from "@/components/client/atoms/CategoryBadge/CategoryBadge";
import PendienteApi from "@/components/client/atoms/PendienteApi/PendienteApi";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";
import { Fine } from "@/types/fines";
import { ETIQUETA_ESTADO_COBRO, esCobroPagable, formatearFechaCobro } from "@/lib/casillero/obligations";
import styles from "./FineCard.module.scss";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

interface FineCardProps {
    fine: Fine;
    onViewDetail?: (id: string) => void;
}

export default function FineCard({ fine, onViewDetail }: FineCardProps) {
    const { toggle, isSelected } = useSelectedFinesStore();
    const selected = isSelected(fine.id);
    // Lo pagado o con pago en proceso se muestra, pero no se puede seleccionar.
    const pagable = esCobroPagable(fine.status, fine.amount);

    return (
        <article className={`${styles.card} ${selected ? styles.cardSelected : ""} ${pagable ? "" : styles.cardNoPagable}`}>
        {/* Checkbox left column */}
            <label
            className={styles.checkboxCol}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Seleccionar multa ${fine.code ?? fine.description}`}
            >
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={selected}
                disabled={!pagable}
                onChange={() => toggle(fine)}
            />
            <div className={`${styles.checkboxCustom} ${selected ? styles.checkboxCustomChecked : ""}`}>
                {selected && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                    d="M2 7l4 4 6-6"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
                )}
            </div>
            </label>

        {/* Content right column */}
        <div className={styles.content}>
            <header className={styles.header}>
            <span className={styles.code}>{fine.code ?? <PendienteApi campo="código" ejemplo={DATOS_DE_EJEMPLO.multa.codigo} />}</span>
            <span className={styles.amount}>Q{fine.amount}</span>
            </header>

            {fine.originalAmount !== undefined && (
            <p className={styles.partial}>Monto original: Q{fine.originalAmount}</p>
            )}

            <div className={styles.badges}>
            {fine.category ? <CategoryBadge category={fine.category} /> : <PendienteApi campo="categoría" />}
            {fine.status && (
                <span className={`${styles.status} ${styles[`status_${fine.status}`] ?? ""}`}>
                {ETIQUETA_ESTADO_COBRO[fine.status]}
                </span>
            )}
            </div>

            <p className={styles.description}>{fine.description}</p>

            <div className={styles.meta}>
            <p>{fine.location ?? <PendienteApi campo="lugar" ejemplo={DATOS_DE_EJEMPLO.multa.lugar} />}</p>
            <p>{fine.date ?? <PendienteApi campo="fecha" ejemplo={DATOS_DE_EJEMPLO.multa.fecha} />}</p>
            {fine.dueDate && <p>Vence: {formatearFechaCobro(fine.dueDate)}</p>}
            </div>

            <button
            type="button"
            className={styles.detailLink}
            onClick={() => onViewDetail?.(fine.id)}
            >
            ver detalle →
            </button>
        </div>
        </article>
    );
}
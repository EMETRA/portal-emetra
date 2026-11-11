"use client";

import CategoryBadge from "@/components/client/atoms/CategoryBadge/CategoryBadge";
import PendienteApi from "@/components/client/atoms/PendienteApi/PendienteApi";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";
import { Fine } from "@/types/fines";
import { esCobroPagable } from "@/lib/casillero/obligations";
import { formatearQuetzales } from "@/lib/casillero/montos";
import styles from "./FineCard.module.scss";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

interface FineCardProps {
    fine: Fine;
    onViewDetail?: (id: string) => void;
}

export default function FineCard({ fine, onViewDetail }: FineCardProps) {
    const { toggle, isSelected } = useSelectedFinesStore();
    const selected = isSelected(fine.id);
    // Lo que la API marca como no pagable se muestra con su motivo, pero no se puede seleccionar.
    const pagable = esCobroPagable(fine);

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
            <span className={styles.code}>{fine.code ?? DATOS_DE_EJEMPLO.multa.codigo}</span>
            <span className={styles.amount}>{formatearQuetzales(fine.amount, fine.currency)}</span>
            </header>


            <div className={styles.badges}>
            {fine.category && <CategoryBadge category={fine.category} />}
            {!pagable && <span className={styles.status}>No disponible para pago</span>}
            </div>

            <p className={styles.description}>{fine.description}</p>

            <div className={styles.meta}>
            <p>{fine.location ?? <PendienteApi campo="lugar" ejemplo={DATOS_DE_EJEMPLO.multa.lugar} />}</p>
            <p>{fine.date ?? DATOS_DE_EJEMPLO.multa.fecha}</p>
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
"use client";

import CategoryBadge from "@/components/client/atoms/CategoryBadge/CategoryBadge";
import { Fine } from "@/types/fines";
import styles from "./FineCard.module.scss";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

interface FineCardProps {
    fine: Fine;
    onViewDetail?: (id: string) => void;
}

export default function FineCard({ fine, onViewDetail }: FineCardProps) {
    const { toggle, isSelected } = useSelectedFinesStore();
    const selected = isSelected(fine.id);

    return (
        <article className={`${styles.card} ${selected ? styles.cardSelected : ""}`}>
        {/* Checkbox left column */}
            <label
            className={styles.checkboxCol}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Seleccionar multa ${fine.code}`}
            >
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={selected}
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
            <span className={styles.code}>{fine.code}</span>
            <span className={styles.amount}>Q{fine.amount}</span>
            </header>

            <CategoryBadge category={fine.category} />

            <p className={styles.description}>{fine.description}</p>

            <div className={styles.meta}>
            <p>{fine.location}</p>
            <p>{fine.date}</p>
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
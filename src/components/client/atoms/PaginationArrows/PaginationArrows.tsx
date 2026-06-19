import styles from "./PaginationArrows.module.scss";

interface PaginationArrowsProps {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    label?: React.ReactNode;
}

export default function PaginationArrows({
    page,
    totalPages,
    onPrev,
    onNext,
    label,
}: PaginationArrowsProps) {
    return (
        <div className={styles.pagination}>
        <button
            type="button"
            className={styles.arrow}
            onClick={onPrev}
            disabled={page === 0}
            aria-label="Página anterior"
        >
            ‹
        </button>
        {label && <span className={styles.label}>{label}</span>}
        <button
            type="button"
            className={styles.arrow}
            onClick={onNext}
            disabled={page >= totalPages - 1}
            aria-label="Página siguiente"
        >
            ›
        </button>
        </div>
    );
}
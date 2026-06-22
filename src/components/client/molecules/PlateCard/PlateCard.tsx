import styles from "./PlateCard.module.scss";

interface PlateCardProps {
    type: string;
    number: string;
    remisiones: number;
    showDetail?: boolean;
    onDelete: () => void;
    onViewDetail: () => void;
}

export default function PlateCard({
    type,
    number,
    remisiones,
    showDetail = true,
    onDelete,
    onViewDetail,
    }: PlateCardProps) {
    return (
        <article className={styles.card}>
        <button
            type="button"
            className={styles.deleteButton}
            onClick={onDelete}
            aria-label="Eliminar placa"
        >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M1 5h16M6 5V3h6v2M7 9v6M11 9v6M2 5l1 13a1 1 0 001 1h10a1 1 0 001-1L16 5H2z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>

        <p className={styles.plateCode}>
            {type} {number}
        </p>

        <p className={styles.remisiones}>
            Remisiones: <strong>{remisiones}</strong>
        </p>

        {showDetail && (
            <button type="button" className={styles.detailLink} onClick={onViewDetail}>
            ver detalle +
            </button>
        )}
        </article>
    );
}
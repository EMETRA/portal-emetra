import CategoryBadge from "@/components/client/atoms/CategoryBadge/CategoryBadge";
import { Fine } from "@/types/fines";
import styles from "./FineCard.module.scss";

interface FineCardProps {
    fine: Fine;
    onViewDetail?: (id: string) => void;
}

export default function FineCard({ fine, onViewDetail }: FineCardProps) {
    return (
        <article className={styles.card}>
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
        </article>
    );
}
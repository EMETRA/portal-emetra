
import { FINE_CATEGORIES, FineCategory } from "@/types/fines";
import styles from "./CategoryBadge.module.scss";

interface CategoryBadgeProps {
    category: FineCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
    const label = FINE_CATEGORIES.find((c) => c.value === category)?.label ?? category;

    return <span className={`${styles.badge} ${styles[category]}`}>{label}</span>;
}
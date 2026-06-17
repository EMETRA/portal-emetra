import { FINE_CATEGORIES, FineCategory } from "@/types/fines";
import styles from "./FineFilterTabs.module.scss";

type FilterValue = "todas" | FineCategory;

interface FineFilterTabsProps {
    value: FilterValue;
    onChange: (value: FilterValue) => void;
}

export default function FineFilterTabs({ value, onChange }: FineFilterTabsProps) {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
            <button
                type="button"
                className={`${styles.tab} ${value === "todas" ? styles.active : ""}`}
                onClick={() => onChange("todas")}
            >
                Todas
            </button>

            {FINE_CATEGORIES.map(({ value: catValue, label }) => (
                <button
                key={catValue}
                type="button"
                className={`${styles.tab} ${value === catValue ? styles.active : ""}`}
                onClick={() => onChange(catValue)}
                >
                {label}
                </button>
            ))}
            </div>
        </div>
    );
}
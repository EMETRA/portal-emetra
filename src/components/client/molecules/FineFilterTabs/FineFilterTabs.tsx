import type { CategoriaCobro } from "@/lib/casillero/categorias";
import styles from "./FineFilterTabs.module.scss";

/** "todas" o el tipo de cobro (texto libre de la API). */
export type FineFilterValue = string;

interface FineFilterTabsProps {
    value: FineFilterValue;
    onChange: (value: FineFilterValue) => void;
    /** Categorías que traen los cobros; se arma un filtro por cada una. */
    categories: CategoriaCobro[];
}

export default function FineFilterTabs({ value, onChange, categories }: FineFilterTabsProps) {
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

            {categories.map(({ value: catValue, label }) => (
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

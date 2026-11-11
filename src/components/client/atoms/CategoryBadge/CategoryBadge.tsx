import { colorCategoria, etiquetaCategoria } from "@/lib/casillero/categorias";
import styles from "./CategoryBadge.module.scss";

interface CategoryBadgeProps {
    /** Tipo de cobro tal como lo manda la API (texto libre, p. ej. "REMISION_TRANSITO"). */
    category: string;
}

/** Muestra cualquier tipo de cobro: texto legible y un color del diseño. */
export default function CategoryBadge({ category }: CategoryBadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[colorCategoria(category)]}`}>
            {etiquetaCategoria(category)}
        </span>
    );
}

"use client";

import { useRouter } from "next/navigation";
import styles from "./FineSelectionBar.module.scss";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

export default function FineSelectionBar() {
    const router = useRouter();
    const { selected, clear, total } = useSelectedFinesStore();

    if (selected.length === 0) return null;

    const handlePagar = () => {
        router.push("/casillero/dashboard/multas/pagar");
    };

    return (
        <div className={styles.bar}>
        <div className={styles.info}>
            <span className={styles.count}>
            {selected.length} multa{selected.length !== 1 ? "s" : ""} seleccionada{selected.length !== 1 ? "s" : ""}
            </span>
            <span className={styles.total}>Total: Q{total().toLocaleString("es-GT")}</span>
        </div>

        <div className={styles.actions}>
            <button type="button" className={styles.clearBtn} onClick={clear}>
            Limpiar
            </button>
            <button type="button" className={styles.payBtn} onClick={handlePagar}>
            Pagar
            </button>
        </div>
        </div>
    );
}
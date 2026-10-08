import React from "react";
import { DenunciaDetalleAccionesProps } from "./types";
import styles from "./DenunciaDetalleAcciones.module.scss";

export const DenunciaDetalleAcciones: React.FC <DenunciaDetalleAccionesProps> = ({
    onAceptarPago,
    onPresentarDefensa,
    loading,
    puedeAceptar = true,
    puedeDefender = true
}) => {
    return (
        <aside className={styles.card}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    ¿Qué deseas hacer?
                </h2>

                <p className={styles.description}>
                    Si estás de acuerdo con la denuncia, puedes aceptarla y continuar al pago. Si no estás de acuerdo, puedes presentar tu defensa.
                </p>
            </header>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={onAceptarPago}
                    disabled={loading || !puedeAceptar}
                >
                    Aceptar y pagar
                </button>
                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={onPresentarDefensa}
                    disabled={loading || !puedeDefender}
                >
                    Presentar defensa
                </button>
            </div>
        </aside>
    );
};

import React from "react";
import styles from "./DenunciaConfirmacionCarga.module.scss";

export const DenunciaConfirmacionCarga: React.FC = () => {
    return (
        <article
            className={styles.card}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className={styles.content}>
                
                <div className={styles.spinnerContainer}>
                    <div className={styles.spinner} />
                </div>

                <div className={styles.message}>
                    <h2 className={styles.title}>
                        Procesando tu aceptación
                    </h2>

                    <p className={styles.description}>
                        Estamos registrando tu aceptación y generando
                        la remisión. No cierres ni recargues esta página.
                    </p>
                </div>

                <div className={styles.loadingButton} aria-hidden="true">
                    Procesando...
                </div>

            </div>
        </article>
    );
};
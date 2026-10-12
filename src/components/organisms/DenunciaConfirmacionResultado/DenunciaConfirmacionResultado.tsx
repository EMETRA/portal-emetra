import React from "react";
import { DenunciaConfirmacionResultadoProps } from "./types";
import styles from "./DenunciaConfirmacionResultado.module.scss";
import { AlertBadge } from "@/components/molecules/AlertBadge";

export const DenunciaConfirmacionResultado: React.FC<DenunciaConfirmacionResultadoProps> = ({
    status,
    numeroRemision = "",
    denuncia,
    onContinuar,
    onReintentar,
    onVolver,
    loading = false
}) => {

    if (status === "error") {
        return (
            <article className={styles.card}>
                <div className={styles.content}>
                    <div className={`${styles.statusIcon} ${styles.errorIcon}`}>
                        <span aria-hidden="true">×</span>
                    </div>

                    <div className={styles.message}>
                        <h2 className={styles.title}>
                            No pudimos registrar tu aceptación
                        </h2>

                        <p className={styles.description}>
                            Ocurrió un problema al procesar tu solicitud.
                            Puedes intentarlo de nuevo; tus datos siguen
                            en pantalla.
                        </p>
                    </div>

                    <div className={styles.errorActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={onReintentar}
                            disabled={loading}
                        >
                            {loading ? "Reintentando..." : "Reintentar"}
                        </button>

                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={onVolver}
                            disabled={loading}
                        >
                            Volver al resumen
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className={styles.card}>
            <div className={styles.content}>
                <div className={`${styles.statusIcon} ${styles.successIcon}`}>
                    <span aria-hidden="true">✓</span>
                </div>

                <div className={styles.message}>
                    <h2 className={styles.title}>
                        Tu aceptación fue registrada
                    </h2>

                    <p className={styles.description}>
                        Ya puedes pagar tu remisión. Guarda el número
                        para buscarla en el portal institucional.
                    </p>
                </div>

                <AlertBadge>
                    <div className={styles.remision}>
                        <span className={styles.remisionLabel}>
                            Número de remisión:
                        </span>

                        <strong className={styles.remisionNumber}>
                            {numeroRemision}
                        </strong>
                    </div>
                </AlertBadge>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>
                            Placa
                        </span>

                        <p className={styles.value}>
                            {denuncia.placa}
                        </p>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.label}>
                            Lugar
                        </span>

                        <p className={styles.amount}>
                            {denuncia.place}
                        </p>
                    </div>
                </div>

                <p className={styles.note}>
                    El importe final se confirma en el portal de pago
                    institucional.
                </p>

                <section className={styles.payment}>
                    <h3 className={styles.paymentTitle}>
                        ¿Cómo pagar?
                    </h3>

                    <ol className={styles.paymentList}>
                        <li>
                            Continúa al portal institucional e inicia sesión.
                        </li>

                        <li>
                            Busca tu remisión con el número indicado arriba.
                        </li>

                        <li>
                            Realiza el pago y conserva tu comprobante.
                        </li>
                    </ol>
                </section>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={onContinuar}
                        disabled={loading}
                    >
                        Continuar al portal institucional
                    </button>
                </footer>
            </div>
        </article>
    );
};
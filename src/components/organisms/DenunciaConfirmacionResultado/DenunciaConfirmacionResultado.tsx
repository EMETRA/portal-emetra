import React from "react";
import { DenunciaConfirmacionResultadoProps } from "./types";
import styles from "./DenunciaConfirmacionResultado.module.scss";
import { formatoMontoBase } from '@/lib/vivi/presentacion';

export const DenunciaConfirmacionResultado: React.FC<DenunciaConfirmacionResultadoProps> = ({
    status,
    numeroRemision = "",
    denuncia,
    onContinuar,
    onReintentar,
    onVolver,
    loading = false,
    pagoDisponible = false,
    yaAceptada = false,
    errorMessage
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
                            {errorMessage || 'Ocurrió un problema al procesar tu solicitud.'}
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
                        {yaAceptada ? 'Esta denuncia ya fue aceptada' : 'Tu aceptación fue registrada'}
                    </h2>

                    <p className={styles.description}>
                        {pagoDisponible ? 'Ya puedes continuar al pago institucional. Guarda el número de remisión.' : 'La remisión fue emitida. El cobro está en preparación; guarda el número y vuelve a consultar más tarde.'}
                    </p>
                </div>

                    <div className={styles.remision}>
                        <span className={styles.remisionLabel}>
                            Número de remisión
                        </span>

                        <strong className={styles.remisionNumber}>
                            {numeroRemision}
                        </strong>
                    </div>

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
                            Monto base
                        </span>

                        <p className={styles.value}>
                            {formatoMontoBase(denuncia.montoBase)}
                        </p>
                    </div>
                </div>

                <p className={styles.note}>
                    El importe final se confirma en el portal de pago
                    institucional.
                </p>

                {pagoDisponible && <section className={styles.payment}>
                    <h3 className={styles.paymentTitle}>
                        Cómo pagar
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
                </section>}

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={pagoDisponible ? onContinuar : onReintentar}
                        disabled={loading}
                    >
                        {pagoDisponible ? 'Continuar al portal institucional' : 'Consultar disponibilidad de pago'}
                    </button>
                </footer>
            </div>
        </article>
    );
};

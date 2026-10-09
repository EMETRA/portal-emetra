import React from "react";
import { DenunciaDetalleConfirmacionProps } from "./types";
import styles from "./DenunciaDetalleConfirmacion.module.scss";

export const DenunciaDetalleConfirmacion: React.FC<DenunciaDetalleConfirmacionProps> = ({
    denuncia,
    onConfirmar,
    onVolver,
    loading = false
}) => {

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    Antes de continuar
                </h2>
                <p className={styles.description}>
                    Al confirmar, aceptas la denuncia y se generará
                    una remisión para que puedas realizar el pago.
                    Revisa que la placa y el hecho sean correctos.
                </p>
            </header>

            <div className={styles.content}>
                <section className={styles.summary}>
                    <div className={styles.topDetails}>
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
                                Fecha y hora
                            </span>
                            <p className={styles.value}>
                                {denuncia.caseDate}
                            </p>
                        </div>
                    </div>

                    <div className={styles.fullDetail}>
                        <span className={styles.label}>
                            Hecho denunciado
                        </span>
                        <p className={styles.value}>
                            {denuncia.denuncia.descripcion}
                        </p>
                    </div>

                    <div className={styles.fullDetail}>
                        <span className={styles.label}>Monto base</span>
                        <p className={styles.value}>Por confirmar en el portal institucional</p>
                    </div>

                    <div className={styles.fullDetail}>
                        <span className={styles.label}>
                            Lugar
                        </span>
                        <p className={styles.value}>
                            {denuncia.place}
                        </p>
                    </div>
                </section>

                <section className={styles.nextSteps}>
                    <h3 className={styles.stepsTitle}>
                        Qué sucede después
                    </h3>

                    <ul className={styles.stepsList}>
                        <li>Se genera tu número de remisión.</li>
                        <li>Recibes las instrucciones de pago.</li>
                        <li>Continúas al portal institucional para iniciar sesión y pagar.</li>
                    </ul>
                </section>
            </div>

            <footer className={styles.footer}>
                <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={onConfirmar}
                    disabled={loading}
                >
                    {loading ? "procesando..." : "Confirmar y aceptar"}
                </button>

                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={onVolver}
                    disabled={loading}
                >
                    Volver
                </button>
            </footer>

        </article>
    )
}

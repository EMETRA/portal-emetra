import React from "react";
import { DenunciaDetalleCardProps } from "./types";
import styles from "./DenunciaDetalleCard.module.scss";
import { AlertBadge } from "@/components/molecules/AlertBadge";
import { Text } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Icon } from "@/components/server/atoms";

export const DenunciaDetalleCard: React.FC <DenunciaDetalleCardProps> = ({
    denuncia,
    loading
}) => {

    const datos = denuncia
        ? [
            { label: "Numero de denuncia", value: denuncia.caseNumber },
            { label: "Placa", value: denuncia.placa },
            { label: "Hecho denunciado", value: denuncia.denuncia.descripcion },
            { label: "Fecha y hora", value: denuncia.caseDate },
        ]
        : [];

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    Resumen de la denuncia
                </h2>
            </header>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.details}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div className={styles.detalleItem} key={index}>
                                <Skeleton width="65%" height="14px" />
                                <Skeleton width={index === 2 ? "90%" : "75%"} height="20px"/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.details}>
                        {datos.map((dato) => (
                            <div className={styles.detalleItem} key={dato.label}>
                                <span className={styles.label}>
                                    {dato.label}
                                </span>

                                <p className={styles.value}>
                                    {dato.value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <AlertBadge>
                    <div className={styles.amountContainer}>
                        <div className={styles.amountDescription}>
                            <Text className={styles.amountTitle}>
                                Lugar
                            </Text>
                            <Text>
                                Donde ocurrió el hecho
                            </Text>
                        </div>
                        {loading || !denuncia ? (
                            <div className={styles.amount}>
                                <Skeleton width="120px" height="34px"/>
                            </div>
                        ): (
                            <Text className={styles.amount}>
                                {denuncia.place}
                            </Text>
                        )}
                        
                    </div>
                </AlertBadge>

                <section className={styles.evidence}>
                    <h3 className={styles.evidenceTitle}>
                        Evidencias
                    </h3>

                    {loading ? (
                        <div className={styles.evidenceList}>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton 
                                    key={index}
                                    className={styles.evidenceImage}
                                    height="150px"
                                    radius="10px"
                                />
                            ))}
                        </div>
                    ) : denuncia && denuncia.denuncia.evidencias.length > 0 ? (
                        <div className={styles.evidenceList}>
                            {denuncia.denuncia.evidencias.map((evidencia) => (
                                <img
                                    key={evidencia.id}
                                    src={evidencia.sourceUrl}
                                    alt={evidencia.name || "Evidencia de la denuncia"}
                                    className={styles.evidenceImage}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noEvidence}>
                            <Icon 
                                name="Image"
                                className={styles.icon}
                            />
                            No hay evidencias para mostrar
                            <Text>
                                Por ahora este enlace no incluye fotos ni video de la denuncia.
                            </Text>
                        </div>
                    )}
                </section>
            </div>
        </article>
    );
};
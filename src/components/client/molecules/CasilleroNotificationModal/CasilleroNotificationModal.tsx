import React, { useEffect, useState } from "react";
import { CasilleroNotificationModalProps } from "./types";
import { PopOver } from "../../atoms/PopOver";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Icon } from "@/components/server/atoms";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/server/atoms";
import {
    CasilleroNotificationError,
    fetchNotificationDetail,
    formatearFechaNotificacion,
    formatearHoraNotificacion,
    isSesionVencida,
} from "@/lib/casillero/notifications";
import type { CasilleroNotificationDetail } from "@/lib/casillero/types";
import styles from "./CasilleroNotificationModal.module.scss";

export const CasilleroNotificationModal = ({
    id,
    isOpen,
    onClose,
    onDownload,
    onSesionVencida,
}: CasilleroNotificationModalProps) => {
    const [notification, setNotification] = useState<CasilleroNotificationDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string; noEncontrada: boolean } | null>(null);
    const [intento, setIntento] = useState(0);

    // El detalle se pide cada vez que se abre (el backend registra la apertura).
    useEffect(() => {
        if (!isOpen || !id) return;

        let cancelado = false;
        setNotification(null);
        setError(null);
        setLoading(true);

        fetchNotificationDetail(id)
            .then((detalle) => {
                if (!cancelado) setNotification(detalle);
            })
            .catch((err) => {
                if (cancelado) return;
                if (isSesionVencida(err) && onSesionVencida) {
                    onSesionVencida();
                    return;
                }
                setError({
                    message: err instanceof Error ? err.message : "No se pudo cargar la notificación. Intenta más tarde",
                    noEncontrada: err instanceof CasilleroNotificationError && err.status === 404,
                });
            })
            .finally(() => {
                if (!cancelado) setLoading(false);
            });

        return () => {
            cancelado = true;
        };
    }, [isOpen, id, intento, onSesionVencida]);

    return (
        <PopOver isOpen={isOpen} onClose={onClose} position="center">
            <div className={styles.modalCard}>
                {loading ? <LoadingSpinner variant="inline" /> : notification ? (
                    <>
                        <div className={styles.header}>
                            <div className={styles.detailsWrapper}>
                                <h2 className={styles.title}>
                                    {notification.subject}
                                </h2>
                                <div className={styles.dateTimeWrapper}>
                                    <Text variant="Small" className={styles.date}>
                                        {formatearFechaNotificacion(notification.issuedAt)}
                                    </Text>
                                    <span className={styles.separator}>•</span>
                                    <Text variant="Small" className={styles.time}>
                                        {formatearHoraNotificacion(notification.issuedAt)}
                                    </Text>
                                </div>
                            </div>

                            <Icon name="Cross" width={24} height={24} className={styles.mainIcon} onClick={onClose} />
                        </div>

                        <div className={styles.descriptionWrapper}>
                            <Text variant="Medium" className={styles.description}>
                                {notification.content || notification.summary}
                            </Text>
                        </div>

                        {notification.hasDocument ? (
                            onDownload && (
                                <Button
                                    variant="success"
                                    className={styles.downloadButton}
                                    onClick={() => onDownload?.(id)}
                                >
                                    Descargar Notificación
                                </Button>
                            )
                        ) : (
                            <Text variant="Small" className={styles.sinDocumento}>
                                Esta notificación no tiene un documento disponible.
                            </Text>
                        )}
                    </>
                ) : error ? (
                    <>
                        <Text variant="Medium" className={styles.description}>
                            {error.message}
                        </Text>
                        <div className={styles.errorActions}>
                            {!error.noEncontrada && (
                                <Button variant="success" onClick={() => setIntento((actual) => actual + 1)}>
                                    Reintentar
                                </Button>
                            )}
                            <Button variant="success" onClick={() => onClose()}>Cerrar</Button>
                        </div>
                    </>
                ) : null}
            </div>
        </PopOver>
    );
};

export default CasilleroNotificationModal;

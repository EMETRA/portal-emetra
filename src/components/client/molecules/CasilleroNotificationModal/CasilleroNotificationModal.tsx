import React, { useEffect, useState } from "react";
import { CasilleroNotificationModalProps } from "./types";
import { PopOver } from "../../atoms/PopOver";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Icon } from "@/components/server/atoms";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/server/atoms";
import styles from "./CasilleroNotificationModal.module.scss";

const DUMMY_DATA = [
    {
      id: '1',
      title: 'Notificación 1',
      description: 'Descripción 1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      date: '2026-06-22',
      time: '10:00',
    },
    {
      id: '2',
      title: 'Notificación 2',
      description: 'Descripción 2',
      date: '2026-06-22',
      time: '10:00',
    },
    {
        id: '3',
        title: 'Notificación 3',
        description: 'Descripción 3',
        date: '2026-06-22',
        time: '10:00',
    },
    {
        id: '4',
        title: 'Notificación 4',
        description: 'Descripción 4',
        date: '2026-06-22',
        time: '10:00',
    },
    
    {
        id: '5',
        title: 'Notificación 5',
        description: 'Descripción 5',
        date: '2026-06-22',
        time: '10:00',
    },
    {
        id: '6',
        title: 'Notificación 6',
        description: 'Descripción 6',
        date: '2026-06-22',
        time: '10:00',
    },
]

export const CasilleroNotificationModal = ({
    id,
    isOpen,
    onClose,
    onDownload,
}: CasilleroNotificationModalProps) => {
    const notification = DUMMY_DATA.find(notification => notification.id === id);

    const [loading, setLoading] = useState(true);

    // fingir una carga de data
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }, []);

    return (
        <PopOver isOpen={isOpen} onClose={onClose} position="center">
            <div className={styles.modalCard}>
                {loading ? <LoadingSpinner variant="inline" /> : notification ? (
                    <>
                        <div className={styles.header}>
                            <div className={styles.detailsWrapper}>
                                <h2 className={styles.title}>
                                    {notification.title}
                                </h2>
                                <div className={styles.dateTimeWrapper}>
                                    <Text variant="Small" className={styles.date}>
                                        {notification.date}
                                    </Text>
                                    <span className={styles.separator}>•</span>
                                    <Text variant="Small" className={styles.time}>
                                        {notification.time}
                                    </Text>
                                </div>
                            </div>

                            <Icon name="Cross" width={24} height={24} className={styles.mainIcon} onClick={onClose} />
                        </div>

                        <div className={styles.descriptionWrapper}>
                            <Text variant="Medium" className={styles.description}>
                                {notification.description}
                            </Text>
                        </div>

                        {onDownload && (
                            <Button 
                                variant="success" 
                                className={styles.downloadButton}
                                onClick={() => onDownload?.(id)}
                            >
                                Descargar Notificación
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <Text variant="Medium" className={styles.description}>
                            No se encontró la notificación.
                        </Text>
                        <Button variant="success" onClick={() => onClose()}>Cerrar</Button>
                    </>
                )}
            </div>
        </PopOver>
    );
};

export default CasilleroNotificationModal;
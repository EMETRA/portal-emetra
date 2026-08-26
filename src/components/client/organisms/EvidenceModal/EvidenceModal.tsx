"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./EvidenceModal.module.scss";

interface EvidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onDownloadImage: () => void;
    onDownloadNotificacion: () => void;
    onDownloadRemisionPdf: () => void;
}

export default function EvidenceModal({
    isOpen,
    onClose,
    imageUrl,
    onDownloadImage,
    onDownloadNotificacion,
    onDownloadRemisionPdf,
}: EvidenceModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onMouseDown={onClose}>
        <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="evidence-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            ×
            </button>

            <h2 id="evidence-modal-title" className={styles.title}>
            Evidencia y documentos
            </h2>

            <div className={styles.imageContainer}>
                <Image src={imageUrl} alt="Evidencia de la infracción" width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} />
            </div>

            <button type="button" className={styles.downloadImageLink} onClick={onDownloadImage}>
            descargar imagen ↓
            </button>

            <div className={styles.actions}>
            <button type="button" className={styles.actionButton} onClick={onDownloadNotificacion}>
                Descargar notificación
            </button>
            <button type="button" className={styles.actionButton} onClick={onDownloadRemisionPdf}>
                Descargar remisión PDF
            </button>
            </div>
        </div>
        </div>
    );
}
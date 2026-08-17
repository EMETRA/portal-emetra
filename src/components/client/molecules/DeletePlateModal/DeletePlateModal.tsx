"use client";

import { useEffect, useState } from "react";
import styles from "./DeletePlateModal.module.scss";

type Step = "confirm" | "success";

interface DeletePlateModalProps {
    plateCode: string | null;
    onConfirm: () => void;
    onClose: () => void;
}

export default function DeletePlateModal({
    plateCode,
    onConfirm,
    onClose,
    }: DeletePlateModalProps) {
    const [step, setStep] = useState<Step>("confirm");

    // Reset step whenever a new plate is targeted
    useEffect(() => {
        if (plateCode) setStep("confirm");
    }, [plateCode]);

    useEffect(() => {
        if (!plateCode) return;
        const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
        document.removeEventListener("keydown", handleKey);
        document.body.style.overflow = "";
        };
    }, [plateCode, onClose]);

    if (!plateCode) return null;

    const handleConfirm = () => {
        onConfirm();
        setStep("success");
    };

    return (
        <div className={styles.overlay} onMouseDown={onClose}>
        <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            ×
            </button>

            {step === "confirm" ? (
            <>
                <h2 className={styles.title}>Solicitar desasociar una placa</h2>
                <p className={styles.body}>
                ¿Estás seguro de solicitar que la placa{" "}
                <strong>{plateCode}</strong> se elimine de tu cuenta?
                </p>
                <p className={styles.warning}>
                Una vez envíes la solicitud, entrará en un proceso de revisión
                para verificar que la placa pueda desasociarse de tu cuenta
                </p>
                <div className={styles.actions}>
                <button type="button" className={styles.confirmButton} onClick={handleConfirm}>
                    Sí, estoy seguro
                </button>
                <button type="button" className={styles.cancelButton} onClick={onClose}>
                    No, voy a revisar
                </button>
                </div>
            </>
            ) : (
            <>
                <h2 className={styles.title}>Solicitud enviada exitosamente</h2>
                <p className={styles.body}>
                Tu solicitud para desasociar la placa{" "}
                <strong>{plateCode}</strong> fue enviada exitosamente.
                </p>
                <p className={styles.warning}>
                Te estaremos informando sobre el proceso
                </p>
                <div className={styles.actions}>
                <button type="button" className={styles.confirmButton} onClick={onClose}>
                    Cerrar
                </button>
                </div>
            </>
            )}
        </div>
        </div>
    );
}
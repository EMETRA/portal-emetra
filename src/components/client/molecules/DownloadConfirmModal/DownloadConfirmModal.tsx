"use client";

import { useEffect } from "react";
import { HistoryRecord, RecordType } from "@/types/historial";
import styles from "./DownloadConfirmModal.module.scss";

const typeLabels: Record<RecordType, string> = {
    recibo: "Recibo",
    solvencia: "Solvencia",
};

interface DownloadConfirmModalProps {
    record: HistoryRecord | null; // null = closed
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DownloadConfirmModal({
    record,
    onConfirm,
    onCancel,
    }: DownloadConfirmModalProps) {
    useEffect(() => {
        if (!record) return;
        const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
        document.removeEventListener("keydown", handleKey);
        document.body.style.overflow = "";
        };
    }, [record, onCancel]);

    if (!record) return null;

    return (
        <div className={styles.overlay} onMouseDown={onCancel}>
        <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className={styles.info}>
            <p className={styles.message}>¿Desea descargar el siguiente documento?</p>
            <div className={styles.detail}>
                <span className={`${styles.typeBadge} ${styles[record.type]}`}>
                {typeLabels[record.type]}
                </span>
                <span className={styles.code}>{record.code}</span>
                <span className={styles.date}>{record.date}</span>
                <span className={styles.amount}>Q{record.amount}</span>
            </div>
            </div>

            <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
                No
            </button>
            <button type="button" className={styles.confirmButton} onClick={onConfirm}>
                Sí, descargar
            </button>
            </div>
        </div>
        </div>
    );
}
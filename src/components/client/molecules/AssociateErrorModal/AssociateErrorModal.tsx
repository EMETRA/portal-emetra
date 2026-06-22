"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AssociateErrorModal.module.scss";

interface AssociateErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string, file: File | null) => void;
}

export default function AssociateErrorModal({
    isOpen,
    onClose,
    onSend,
    }: AssociateErrorModalProps) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
        document.removeEventListener("keydown", handleKey);
        document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
        setMessage("");
        setFile(null);
        }
    }, [isOpen]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    if (!isOpen) return null;

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

            <div className={styles.errorIcon}>!</div>

            <h2 className={styles.title}>
            Ha ocurrido un error al intentar asociar la placa
            </h2>

            <p className={styles.subtitle}>
            Puede enviar una solicitud para que su caso sea revisado por EMETRA.
            </p>

            <textarea
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describa su caso..."
            rows={4}
            />

            <div
            className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            >
            <input
                ref={fileInputRef}
                type="file"
                className={styles.hiddenInput}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className={styles.uploadIcon}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                stroke="#1b2a6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3"
                stroke="#1b2a6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {file ? (
                <p className={styles.fileName}>{file.name}</p>
            ) : (
                <>
                <p className={styles.dropText}>
                    Arrastra tu archivo aqui o{" "}
                    <span className={styles.clickLink}>da click aqui</span>
                </p>
                <p className={styles.maxSize}>900 MB tamaño maximo del archivo</p>
                </>
            )}
            </div>

            <button
            type="button"
            className={styles.sendButton}
            onClick={() => onSend(message, file)}
            >
            Enviar Correo
            </button>
        </div>
        </div>
    );
}
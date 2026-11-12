"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import styles from "./AssociateErrorModal.module.scss";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

interface AssociateErrorModalProps {
    isOpen: boolean;
    description?: string;
    onClose: () => void;
    onSend: (message: string, documents: File[]) => Promise<void>;
}

export default function AssociateErrorModal({
    isOpen,
    description,
    onClose,
    onSend,
    }: AssociateErrorModalProps) {
    const [message, setMessage] = useState("");
    const [documents, setDocuments] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);
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
        setDocuments([]);
        setError("");
        }
    }, [isOpen]);

    const handleSend = async () => {
        const reason = message.trim();
        if (reason.length < 8) {
            setError("Describe el motivo de la revisión con al menos 8 caracteres.");
            return;
        }
        setIsSending(true);
        setError("");
        try {
            await onSend(reason, documents);
        } catch (sendError) {
            setError(sendError instanceof Error ? sendError.message : "No se pudo solicitar la revisión.");
        } finally {
            setIsSending(false);
        }
    };

    const addDocuments = (selectedFiles: File[]) => {
        const invalidType = selectedFiles.find((file) => !ACCEPTED_TYPES.has(file.type));
        if (invalidType) {
            setError(`El archivo ${invalidType.name} no es PDF, JPG, JPEG o PNG.`);
            return;
        }
        const oversized = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);
        if (oversized) {
            setError(`El archivo ${oversized.name} supera el límite de 10 MB.`);
            return;
        }

        const nextFiles = [...documents];
        selectedFiles.forEach((file) => {
            const duplicated = nextFiles.some(
                (current) =>
                    current.name === file.name &&
                    current.size === file.size &&
                    current.lastModified === file.lastModified
            );
            if (!duplicated) nextFiles.push(file);
        });
        if (nextFiles.length > MAX_FILES) {
            setError(`Puedes adjuntar un máximo de ${MAX_FILES} archivos.`);
            return;
        }
        setDocuments(nextFiles);
        setError("");
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        addDocuments(Array.from(event.target.files ?? []));
        event.target.value = "";
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        addDocuments(Array.from(event.dataTransfer.files));
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
            Solicitar revisión de la asociación
            </h2>

            <p className={styles.subtitle}>
            {description || "La validación automática no pudo completarse. Puedes solicitar que un analista revise el caso."}
            </p>

            <textarea
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describa su caso..."
            rows={4}
            />

            <div
            className={styles.dropzone}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            >
            <input
                ref={fileInputRef}
                className={styles.hiddenInput}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                multiple
                onChange={handleFileChange}
            />
            <p className={styles.dropText}>
                Arrastra tus documentos o <span className={styles.clickLink}>selecciónalos</span>
            </p>
            <p className={styles.maxSize}>PDF, JPG, JPEG o PNG. Máximo 5 archivos de 10 MB cada uno.</p>
            </div>

            {documents.length > 0 && (
            <ul className={styles.fileList} aria-label="Documentos seleccionados">
                {documents.map((document, index) => (
                <li key={`${document.name}-${document.lastModified}`} className={styles.fileItem}>
                    <span>{document.name}</span>
                    <button
                    type="button"
                    className={styles.removeFile}
                    onClick={() => setDocuments((current) => current.filter((_, position) => position !== index))}
                    aria-label={`Quitar ${document.name}`}
                    >
                    Quitar
                    </button>
                </li>
                ))}
            </ul>
            )}

            {error && <p role="alert" className={styles.subtitle}>{error}</p>}

            <button
            type="button"
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isSending}
            >
            {isSending ? "Enviando..." : "Solicitar revisión"}
            </button>
        </div>
        </div>
    );
}

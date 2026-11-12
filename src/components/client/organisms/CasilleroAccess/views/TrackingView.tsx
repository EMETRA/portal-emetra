"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/server/atoms";
import AccessField from "../fields/AccessField";
import styles from "../CasilleroAccess.module.scss";
import { getRegistrationStatus } from "@/lib/casillero/api";
import { RegistrationStatus, RegistrationStatusResponse } from "@/lib/casillero/types";

type Props = {
    onLogin: () => void;
    initialCode?: string;
};

const STATUS_LABEL: Record<RegistrationStatus, string> = {
    PENDING: "Pendiente",
    UNDER_REVIEW: "En revisión",
    OBSERVED: "Con observaciones",
    APPROVED: "Aprobada",
    REJECTED: "Rechazada",
};

const STATUS_CLASS: Record<RegistrationStatus, string> = {
    PENDING: styles.statusPending,
    UNDER_REVIEW: styles.statusReview,
    OBSERVED: styles.statusReview,
    APPROVED: styles.statusApproved,
    REJECTED: styles.statusRejected,
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function TrackingView({ onLogin, initialCode = "" }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState<RegistrationStatusResponse | null>(null);

    useEffect(() => {
        if (!initialCode) return;
        let active = true;
        setLoading(true);
        void getRegistrationStatus(initialCode)
            .then((data) => { if (active) setResult(data); })
            .catch((error) => {
                if (active) setMessage(error instanceof Error ? error.message : "No se pudo consultar la solicitud.");
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [initialCode]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
        event.preventDefault();
        setMessage("");
        setResult(null);

        const formData = new FormData(event.currentTarget);
        const code = String(formData.get("trackingCode") ?? "").trim();

        if (!code) {
            setMessage("Ingresa tu código de seguimiento.");
            return;
        }
        setLoading(true);
        const data = await getRegistrationStatus(code);
        setResult(data);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "No se pudo consultar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.description}>
            {initialCode ? `Tu código de seguimiento es ${initialCode}. Guárdalo para consultar tu solicitud.` : "Ingresa tu código de seguimiento para consultar tu solicitud de registro."}
        </p>

        <AccessField
            id="trackingCode"
            label="Código de seguimiento"
            type="text"
            placeholder="n3x8kQ1pW2sR4tU6vY"
            autoComplete="off"
            defaultValue={initialCode}
            required
        />

        <div className={styles.loginActions}>
            <Button
            type="submit"
            variant="success"
            className={styles.submitButton}
            disabled={loading}
            >
            {loading ? "Consultando..." : "Consultar"}
            </Button>
            <button
            type="button"
            className={styles.forgotPassword}
            onClick={onLogin}
            >
            Volver al inicio de sesión
            </button>
        </div>

        {message && <p className={styles.formMessage}>{message}</p>}

        {result && (
            <div className={styles.result}>
            <div className={styles.resultHeader}>
                <span className={styles.trackingCode}>
                Seguimiento: {result.trackingCode}
                </span>
                <span className={`${styles.statusBadge} ${STATUS_CLASS[result.status]}`}>
                {STATUS_LABEL[result.status]}
                </span>
            </div>

            <p className={styles.submittedAt}>
                Enviada el {formatDate(result.submittedAt)}
            </p>

            {result.observations.length > 0 && (
                <div className={styles.observations}>
                <p className={styles.observationsTitle}>Observaciones</p>
                {result.observations.map((obs, i) => (
                    <div key={i} className={styles.observation}>
                    <p className={styles.observationMessage}>
                        {obs.message}
                    </p>
                    <p className={styles.observationDate}>
                        {formatDate(obs.recordedAt)}
                    </p>
                    </div>
                ))}
                </div>
            )}
            </div>
        )}
        </form>
    );
}

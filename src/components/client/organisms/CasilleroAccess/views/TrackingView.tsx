"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/server/atoms";
import AccessField from "../fields/AccessField";
import styles from "../CasilleroAccess.module.scss";
import { getRegistrationStatus } from "@/lib/casillero/api";
import { RegistrationStatus, RegistrationStatusResponse } from "@/lib/casillero/types";

type Props = {
    onLogin: () => void;
};

const STATUS_LABEL: Record<RegistrationStatus, string> = {
    PENDING: "Pendiente de revisión",
    IN_REVIEW: "En revisión",
    APPROVED: "Aprobada",
    REJECTED: "Rechazada",
};

const STATUS_CLASS: Record<RegistrationStatus, string> = {
    PENDING: styles.statusPending,
    IN_REVIEW: styles.statusReview,
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

// DELETE, ONLY FOR MOCKING PURPOSES. This is a temporary mock to simulate API responses for testing the UI.
const MOCK_RESULTS: RegistrationStatusResponse[] = [
    {
        trackingCode: "n3x8kQ1pW2sR4tU6vY",
        status: "PENDING",
        submittedAt: "2026-08-21T17:00:00.000Z",
        observations: [],
    },
    {
        trackingCode: "m7pK9wXzQ2nR5tY8uL",
        status: "IN_REVIEW",
        submittedAt: "2026-08-20T14:30:00.000Z",
        observations: [
        {
            message: "El escaneo del documento no es legible. Cargue una imagen nítida.",
            recordedAt: "2026-08-21T10:00:00.000Z",
        },
        ],
    },
    {
        trackingCode: "p4xV6bNcW8mT3kU1sJ",
        status: "APPROVED",
        submittedAt: "2026-08-19T09:00:00.000Z",
        observations: [],
    },
    {
        trackingCode: "q2yH5dPrE7nK4oI9aF",
        status: "REJECTED",
        submittedAt: "2026-08-18T11:00:00.000Z",
        observations: [
        {
            message: "El DPI presentado está vencido. Presente un documento vigente.",
            recordedAt: "2026-08-19T08:00:00.000Z",
        },
        {
            message: "La fotografía del documento no coincide con los datos ingresados.",
            recordedAt: "2026-08-20T09:30:00.000Z",
        },
        ],
    },
];

export default function TrackingView({ onLogin }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState<RegistrationStatusResponse | null>(null);

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
        } catch (err: any) {
            setMessage(err.message ?? "Ocurrió un error al consultar. Intenta de nuevo.");
            // TODO: quitar esto cuando el backend esté disponible
            // const random = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
            // setResult(random);
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.description}>
            Ingresa el código de seguimiento que recibiste al crear tu solicitud de registro.
        </p>

        <AccessField
            id="trackingCode"
            label="Código de seguimiento"
            type="text"
            placeholder="n3x8kQ1pW2sR4tU6vY"
            autoComplete="off"
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
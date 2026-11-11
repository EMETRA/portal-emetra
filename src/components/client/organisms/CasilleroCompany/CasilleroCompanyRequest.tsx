"use client";

import { FormEvent, useEffect, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import { nitSchema } from "@/schema/casillero";
import {
    canOpenRequest,
    companyHomePath,
    createCompanyRegistrationRequest,
    getCompanyRegistrationRequest,
    useCompanyAccess,
    type CompanyRegistrationRequest,
} from "@/lib/casillero/company";
import { CompanyError, CompanyLoading, CompanyUnauthorized, companyLabel, formatCompanyDate } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export default function CasilleroCompanyRequest() {
    const { status, access, errorMessage, load } = useCompanyAccess();
    const [request, setRequest] = useState<CompanyRegistrationRequest | null>(null);
    const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "error">("idle");
    const [detailError, setDetailError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const requestId = access.request?.id ?? null;

    useEffect(() => {
        if (status !== "ready" || !requestId) {
            return;
        }

        if (request?.id === requestId) {
            setDetailStatus("idle");
            return;
        }

        let cancelled = false;
        setDetailStatus("loading");
        setDetailError("");
        void getCompanyRegistrationRequest(requestId)
            .then((data) => {
                if (cancelled) return;
                setRequest(data);
                setDetailStatus("idle");
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                setDetailError(error instanceof Error ? error.message : "No se pudo cargar la solicitud.");
                setDetailStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [status, requestId, request?.id, attempt]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError("");
        const form = new FormData(event.currentTarget);
        const nit = String(form.get("nit") ?? "");
        const razonSocial = String(form.get("razonSocial") ?? "").trim();
        const file = form.get("documento");

        try {
            await nitSchema.validate(nit);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "El NIT no es válido.");
            return;
        }

        if (razonSocial.length < 3) {
            setFormError("Ingresa la razón social.");
            return;
        }

        if (!(file instanceof File) || file.size === 0) {
            setFormError("Adjunta el documento de representación legal.");
            return;
        }

        if (file.size > MAX_DOCUMENT_BYTES) {
            setFormError("El archivo no puede superar 10 MB.");
            return;
        }

        setSubmitting(true);
        try {
            const created = await createCompanyRegistrationRequest({
                nit,
                razonSocial,
                documentoNombre: file.name,
            });
            setRequest(created);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "No se pudo enviar la solicitud.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <SectionTitle>{access.request || request ? "Mi solicitud" : "Solicitar empresa"}</SectionTitle>
            <CardGeneral className={styles.card} padding="lg">
                {status === "loading" || status === "idle" ? (
                    <CompanyLoading label="Cargando tu solicitud..." />
                ) : status === "error" ? (
                    <CompanyError message={errorMessage} onRetry={() => void load()} />
                ) : !canOpenRequest(access) ? (
                    <CompanyUnauthorized
                        message="Ya perteneces a una empresa. Esta solicitud no está disponible."
                        href={companyHomePath(access)}
                        linkLabel="Ir a mi empresa"
                    />
                ) : detailStatus === "loading" ? (
                    <CompanyLoading label="Cargando el estado de la solicitud..." />
                ) : detailStatus === "error" ? (
                    <CompanyError
                        message={detailError}
                        onRetry={() => setAttempt((current) => current + 1)}
                    />
                ) : request ? (
                    <dl className={styles.details}>
                        <div className={styles.detail}>
                            <dt>Estado</dt>
                            <dd>{companyLabel(request.estado)}</dd>
                        </div>
                        <div className={styles.detail}>
                            <dt>Razón social</dt>
                            <dd>{request.razonSocial}</dd>
                        </div>
                        <div className={styles.detail}>
                            <dt>NIT</dt>
                            <dd>{request.nit}</dd>
                        </div>
                        <div className={styles.detail}>
                            <dt>Documento de representación legal</dt>
                            <dd>{request.documento.nombre}</dd>
                        </div>
                        <div className={styles.detail}>
                            <dt>Enviada</dt>
                            <dd>{formatCompanyDate(request.creadaEn)}</dd>
                        </div>
                        {request.motivoRechazo ? (
                            <div className={styles.detail}>
                                <dt>Motivo del rechazo</dt>
                                <dd>{request.motivoRechazo}</dd>
                            </div>
                        ) : null}
                    </dl>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <p className={styles.hint}>
                            <strong>Nota:</strong> La solicitud queda pendiente de revisión. Todavía no crea una empresa activa.
                        </p>
                        <label className={styles.field} htmlFor="nit">
                            <span className={styles.label}>NIT</span>
                            <Input id="nit" name="nit" type="text" placeholder="12345678" required className={styles.input} />
                        </label>
                        <label className={styles.field} htmlFor="razonSocial">
                            <span className={styles.label}>Razón social</span>
                            <Input id="razonSocial" name="razonSocial" type="text" placeholder="Transportes Aurora, S.A." required className={styles.input} />
                        </label>
                        <label className={styles.field} htmlFor="documento">
                            <span className={styles.label}>Documento de representación legal</span>
                            <input
                                id="documento"
                                name="documento"
                                type="file"
                                accept=".pdf,image/jpeg,image/png"
                                required
                                className={styles.fileInput}
                            />
                            <span className={styles.hint}>PDF, JPG o PNG. Máximo 10 MB.</span>
                        </label>
                        {formError ? <p className={`${styles.message} ${styles.error}`} role="alert">{formError}</p> : null}
                        <Button type="submit" variant="success" className={styles.submit} disabled={submitting}>
                            {submitting ? "Enviando..." : "Enviar solicitud"}
                        </Button>
                    </form>
                )}
            </CardGeneral>
        </div>
    );
}

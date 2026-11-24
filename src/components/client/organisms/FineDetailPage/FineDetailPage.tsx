"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import FineDetailHeader from "@/components/client/organisms/FineDetailHeader/FineDetailHeader";
import EvidenceModal from "@/components/client/organisms/EvidenceModal/EvidenceModal";
import InfoCard from "@/components/client/molecules/InfoCard/InfoCard";
import InfoField from "../../atoms/InfoField/InfoField";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";
import { Button } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Text } from "@/components/atoms/Text";
import styles from "./FineDetailPage.module.scss";
import type { CasilleroObligationDetail } from "@/lib/casillero/types";
import {
    CasilleroCobrosError,
    esCobroPagable,
    fetchObligationDetail,
    formatearFechaHoraCobro,
    formatearFechaLargaCobro,
    isPeticionCancelada,
    isSesionVencidaCobros,
    msHastaVencerMonto,
    obligacionAMulta,
} from "@/lib/casillero/obligations";
import { useSessionStore } from "@/store/useSessionStore";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

/* `validUntil` es la vigencia del monto calculado, no la fecha límite legal de pago. */
const EJEMPLO = DATOS_DE_EJEMPLO.multa;
export default function FineDetailPage({ fineId }: { fineId: string }) {
    const router = useRouter();
    const { addOne } = useSelectedFinesStore();
    const clearSession = useSessionStore((state) => state.clearSession);

    const [detalle, setDetalle] = useState<CasilleroObligationDetail | null>(null);
    const [error, setError] = useState<{ mensaje: string; noEncontrado: boolean } | null>(null);
    const [intento, setIntento] = useState(0);
    const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
    const [evidenceExtension, setEvidenceExtension] = useState<"jpg" | "png">("jpg");
    const [evidenceLoading, setEvidenceLoading] = useState(false);
    const [evidenceError, setEvidenceError] = useState<string | null>(null);

    useEffect(() => () => {
        if (evidenceUrl) URL.revokeObjectURL(evidenceUrl);
    }, [evidenceUrl]);

    // 401 del backend: la sesión venció o fue revocada; se limpia y se vuelve al login.
    const irAlLoginPorSesionVencida = useCallback(() => {
        clearSession();
        router.replace("/casillero");
    }, [clearSession, router]);

    // Siempre se pide al abrir (sin caché): la API vuelve a validar el vehículo y los montos
    // pueden cambiar. Al salir o reintentar se cancela la petición anterior.
    useEffect(() => {
        const control = new AbortController();
        setDetalle(null);
        setError(null);

        fetchObligationDetail(fineId, control.signal)
            .then((respuesta) => {
                if (!control.signal.aborted) setDetalle(respuesta);
            })
            .catch((err) => {
                if (control.signal.aborted || isPeticionCancelada(err)) return;
                if (isSesionVencidaCobros(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                setError({
                    mensaje: err instanceof Error ? err.message : "No se pudo cargar el cobro. Intenta más tarde",
                    noEncontrado: err instanceof CasilleroCobrosError && err.status === 404,
                });
            });

        return () => control.abort();
    }, [fineId, intento, irAlLoginPorSesionVencida]);

    // Cuando vence el monto (validUntil) se vuelve a pedir el detalle sin mostrar la carga;
    // si esa consulta falla, se queda lo que ya se ve (salvo sesión vencida).
    useEffect(() => {
        const ms = msHastaVencerMonto(detalle?.validUntil);
        if (ms === null) return;
        const control = new AbortController();
        const timer = setTimeout(() => {
            fetchObligationDetail(fineId, control.signal)
                .then((respuesta) => {
                    if (!control.signal.aborted) setDetalle(respuesta);
                })
                .catch((err) => {
                    if (!control.signal.aborted && isSesionVencidaCobros(err)) irAlLoginPorSesionVencida();
                });
        }, ms);
        return () => {
            clearTimeout(timer);
            control.abort();
        };
    }, [detalle?.validUntil, fineId, irAlLoginPorSesionVencida]);

    if (!detalle) {
        return (
            <>
            <SectionTitle>Detalle de Multa</SectionTitle>
            <div className={styles.estado}>
                {error ? (
                    <>
                    <Text variant="Medium">{error.mensaje}</Text>
                    {error.noEncontrado ? (
                        <Button variant="success" onClick={() => router.push("/casillero/dashboard/multas")}>
                            Volver a Multas
                        </Button>
                    ) : (
                        <Button variant="success" onClick={() => setIntento((actual) => actual + 1)}>
                            Reintentar
                        </Button>
                    )}
                    </>
                ) : (
                    <LoadingSpinner variant="inline" />
                )}
            </div>
            </>
        );
    }

    const fine = obligacionAMulta(detalle);
    const pagable = esCobroPagable(fine);
    const remision = detalle.remissionDetail;
    const primeraRegla = remision?.violations?.[0];

    const handlePayThis = () => {
        if (!pagable) return;
        addOne(fine);
        router.push("/casillero/dashboard/multas/pagar");
    };

    const handleViewEvidence = async () => {
        if (evidenceLoading) return;
        setEvidenceLoading(true);
        setEvidenceError(null);
        try {
            const response = await fetch(`/api/casillero/obligations/${encodeURIComponent(fineId)}/evidence/1`, {
                credentials: "same-origin",
                cache: "no-store",
            });
            if (response.status === 401) { irAlLoginPorSesionVencida(); return; }
            if (!response.ok) throw new Error(response.status === 404 ? "Esta remisión no tiene imagen disponible." : "No se pudo consultar la imagen.");
            const blob = await response.blob();
            if (!blob.type.startsWith("image/")) throw new Error("La evidencia recibida no es una imagen válida.");
            setEvidenceExtension(blob.type === "image/png" ? "png" : "jpg");
            setEvidenceUrl(URL.createObjectURL(blob));
        } catch (err) {
            setEvidenceError(err instanceof Error ? err.message : "No se pudo consultar la imagen.");
        } finally {
            setEvidenceLoading(false);
        }
    };

    const closeEvidence = () => {
        setEvidenceUrl(null);
    };

    const downloadEvidence = () => {
        if (!evidenceUrl) return;
        const link = document.createElement("a");
        link.href = evidenceUrl;
        link.download = `remision-${detalle.series ?? ""}${detalle.number ?? fineId}.${evidenceExtension}`;
        link.click();
    };

    return (
        <>
        <SectionTitle>Detalle de Multa</SectionTitle>

        <FineDetailHeader
            series={detalle.series?.trim() || undefined}
            number={detalle.number?.trim() || undefined}
            category={fine.category}
            totalAmount={fine.amount}
            currency={fine.currency}
            breakdown={fine.breakdown}
            validUntil={
                // Solo si todavía no venció; al vencer se vuelve a consultar (efecto de arriba).
                msHastaVencerMonto(fine.validUntil) !== null && fine.validUntil
                    ? formatearFechaHoraCobro(fine.validUntil) || undefined
                    : undefined
            }
            unavailableReason={fine.unavailableReason}
            description={fine.description}
            date={formatearFechaLargaCobro(remision?.occurredAt ?? detalle.issuedAt) || undefined}
            location={remision?.location ?? undefined}
            article={primeraRegla?.article}
            numeral={primeraRegla?.numeral ?? undefined}
            onPayThis={handlePayThis}
            canPay={pagable}
            onVerImagen={remision ? handleViewEvidence : undefined}
        />

        {(evidenceLoading || evidenceError) && (
            <div className={styles.estado} role="status">
                {evidenceLoading ? <LoadingSpinner variant="inline" /> : <Text variant="Medium">{evidenceError}</Text>}
            </div>
        )}

        <EvidenceModal
            isOpen={Boolean(evidenceUrl)}
            onClose={closeEvidence}
            imageUrl={evidenceUrl ?? ""}
            onDownloadImage={downloadEvidence}
        />

        <div className={styles.infoGrid}>
            <InfoCard title="Información Adicional" icon="idCard">
            <InfoField label="Conductor" value={remision?.driverName ?? <PendienteApi campo="conductor" />} />
            <InfoField label="Licencia" value={remision?.licenseNumber ?? <PendienteApi campo="licencia" />} />
            <InfoField label="Tipo de licencia" value={remision?.licenseType ?? <PendienteApi campo="tipo de licencia" />} />
            </InfoCard>

            <InfoCard title="Información Legal" icon="legal">
            <InfoField label="Persona notificada" value={remision?.notifiedPerson ?? <PendienteApi campo="persona notificada" />} />
            <InfoField label="Fecha de impugnación" value={<PendienteApi campo="fecha de impugnación" ejemplo={EJEMPLO.fechaImpugnacion} />} />
            <InfoField
                label="Última fecha para pagar"
                value={
                    remision?.paymentDeadline
                        ? formatearFechaLargaCobro(remision.paymentDeadline)
                        : <PendienteApi campo="última fecha para pagar" />
                }
            />
            </InfoCard>
        </div>

        <InfoCard title="Descripción" icon="document" className={styles.descriptionCard}>
            <p className={styles.descriptionText}>{remision?.observations ?? <PendienteApi campo="descripción" />}</p>
        </InfoCard>
        </>
    );
}

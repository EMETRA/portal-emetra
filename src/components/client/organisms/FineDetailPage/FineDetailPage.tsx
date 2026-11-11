"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import FineDetailHeader from "@/components/client/organisms/FineDetailHeader/FineDetailHeader";
import InfoCard from "@/components/client/molecules/InfoCard/InfoCard";
import InfoField from "../../atoms/InfoField/InfoField";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";
import EvidenceModal from "@/components/client/organisms/EvidenceModal/EvidenceModal";
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

/*
  TODO [CASILLERO-BACKEND]: el detalle de la API de Cobros trae concepto, tipo de cobro,
  montos (base, recargo, descuento, total), fechas (emisión, consulta, validUntil) y si se
  puede pagar, además de serie y número. Lugar, artículo, numeral, evidencia, conductor, licencia,
  persona notificada, impugnación, última fecha de pago y descripción larga se muestran con
  datos de ejemplo (PendienteApi) hasta saber si vendrán y con qué nombres.
  `validUntil` NO es la última fecha de pago: es hasta cuándo vale el monto calculado
  (Daniel, 2026-11-11), por eso no se usa en ese campo.
*/
const EJEMPLO = DATOS_DE_EJEMPLO.multa;
export default function FineDetailPage({ fineId }: { fineId: string }) {
    const router = useRouter();
    const { addOne } = useSelectedFinesStore();
    const clearSession = useSessionStore((state) => state.clearSession);

    const [detalle, setDetalle] = useState<CasilleroObligationDetail | null>(null);
    const [error, setError] = useState<{ mensaje: string; noEncontrado: boolean } | null>(null);
    const [intento, setIntento] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handlePayThis = () => {
        if (!pagable) return;
        addOne(fine);
        router.push("/casillero/dashboard/multas/pagar");
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
            date={formatearFechaLargaCobro(detalle.issuedAt) || undefined}
            onPayThis={handlePayThis}
            canPay={pagable}
            onVerImagen={() => setIsModalOpen(true)}
            evidenciaDeEjemplo
        />

        <div className={styles.infoGrid}>
            <InfoCard title="Información Adicional" icon="idCard">
            <InfoField label="Conductor" value={<PendienteApi campo="conductor" ejemplo={EJEMPLO.conductor} />} />
            <InfoField label="Licencia" value={<PendienteApi campo="licencia" ejemplo={EJEMPLO.licencia} />} />
            <InfoField label="Tipo de licencia" value={<PendienteApi campo="tipo de licencia" ejemplo={EJEMPLO.tipoLicencia} />} />
            </InfoCard>

            <InfoCard title="Información Legal" icon="legal">
            <InfoField label="Persona notificada" value={<PendienteApi campo="persona notificada" ejemplo={EJEMPLO.personaNotificada} />} />
            <InfoField label="Fecha de impugnación" value={<PendienteApi campo="fecha de impugnación" ejemplo={EJEMPLO.fechaImpugnacion} />} />
            <InfoField label="Última fecha de pago" value={<PendienteApi campo="última fecha de pago" ejemplo={EJEMPLO.ultimaFechaPago} />} />
            </InfoCard>
        </div>

        <InfoCard title="Descripción" icon="document" className={styles.descriptionCard}>
            <p className={styles.descriptionText}><PendienteApi campo="descripción" ejemplo={EJEMPLO.descripcion} /></p>
        </InfoCard>

        {/* TODO [CASILLERO-BACKEND]: imagen y descargas de ejemplo hasta que la API mande la evidencia. */}
        <EvidenceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            imageUrl={EJEMPLO.evidenciaUrl}
            onDownloadImage={() => {}}
            onDownloadNotificacion={() => {}}
            onDownloadRemisionPdf={() => {}}
        />
        </>
    );
}

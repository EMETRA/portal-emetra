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
    formatearFechaCobro,
    isSesionVencidaCobros,
    obligacionAMulta,
} from "@/lib/casillero/obligations";
import { useSessionStore } from "@/store/useSessionStore";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

/*
  TODO [CASILLERO-BACKEND]: el detalle de la API de Cobros solo trae concepto, monto, saldo,
  estado, vencimiento y categoría. Serie, número, fecha, lugar, artículo, numeral,
  evidencia, conductor, licencia, persona notificada, impugnación y descripción larga
  se muestran con datos de ejemplo (PendienteApi) hasta saber si vendrán y con qué nombres.
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

    useEffect(() => {
        let cancelado = false;
        setDetalle(null);
        setError(null);

        fetchObligationDetail(fineId)
            .then((respuesta) => {
                if (!cancelado) setDetalle(respuesta);
            })
            .catch((err) => {
                if (cancelado) return;
                if (isSesionVencidaCobros(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                setError({
                    mensaje: err instanceof Error ? err.message : "No se pudo cargar el cobro. Intenta más tarde",
                    noEncontrado: err instanceof CasilleroCobrosError && err.status === 404,
                });
            });

        return () => {
            cancelado = true;
        };
    }, [fineId, intento, irAlLoginPorSesionVencida]);

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
    const pagable = esCobroPagable(fine.status, fine.amount);

    const handlePayThis = () => {
        if (!pagable) return;
        addOne(fine);
        router.push("/casillero/dashboard/multas/pagar");
    };

    return (
        <>
        <SectionTitle>Detalle de Multa</SectionTitle>

        <FineDetailHeader
            category={fine.category}
            totalAmount={fine.amount}
            originalAmount={fine.originalAmount}
            status={fine.status}
            description={fine.description}
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
            <InfoField label="Última fecha de pago" value={formatearFechaCobro(detalle.dueDate)} />
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

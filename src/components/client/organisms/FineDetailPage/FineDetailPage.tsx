"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import FineDetailHeader from "@/components/client/organisms/FineDetailHeader/FineDetailHeader";
import InfoCard from "@/components/client/molecules/InfoCard/InfoCard";
import InfoField from "../../atoms/InfoField/InfoField";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";
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
  quedan como pendientes (PendienteApi) hasta saber si vendrán y con qué nombres.
*/
export default function FineDetailPage({ fineId }: { fineId: string }) {
    const router = useRouter();
    const { addOne } = useSelectedFinesStore();
    const clearSession = useSessionStore((state) => state.clearSession);

    const [detalle, setDetalle] = useState<CasilleroObligationDetail | null>(null);
    const [error, setError] = useState<{ mensaje: string; noEncontrado: boolean } | null>(null);
    const [intento, setIntento] = useState(0);

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
        />

        {/* Información adicional: la API no manda ninguno de sus datos, así que solo queda la marca. */}
        <PendienteApi campo="información adicional (conductor, licencia, tipo de licencia)" />

        <InfoCard title="Información Legal" icon="legal" className={styles.legalCard}>
            <PendienteApi campo="persona notificada" />
            <PendienteApi campo="fecha de impugnación" />
            <InfoField label="Última fecha de pago" value={formatearFechaCobro(detalle.dueDate)} />
        </InfoCard>

        <PendienteApi campo="descripción larga" />
        </>
    );
}

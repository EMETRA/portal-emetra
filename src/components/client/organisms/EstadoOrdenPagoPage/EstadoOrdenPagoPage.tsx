"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Text } from "@/components/atoms/Text";
import type { CasilleroPaymentOrder } from "@/lib/casillero/types";
import {
    CasilleroPaymentOrderError,
    SEGUNDOS_ENTRE_CONSULTAS,
    estadoVisualOrden,
    fetchPaymentOrder,
    isSesionVencidaOrden,
} from "@/lib/casillero/paymentOrders";
import { formatearFechaCobro } from "@/lib/casillero/obligations";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "./EstadoOrdenPagoPage.module.scss";

const MULTAS = "/casillero/dashboard/multas";

/**
 * Estado de una orden de pago. Mientras el pago está en proceso se vuelve a consultar
 * sola unas veces; si no se confirma, pide volver a consultar más tarde. Solo una orden
 * CONFIRMADA se muestra como pago hecho.
 */
export default function EstadoOrdenPagoPage({ orderId }: { orderId: string }) {
    const router = useRouter();
    const clearSession = useSessionStore((state) => state.clearSession);

    const [orden, setOrden] = useState<CasilleroPaymentOrder | null>(null);
    const [error, setError] = useState<{ mensaje: string; noEncontrada: boolean } | null>(null);
    const [consultando, setConsultando] = useState(true);
    // Consultas hechas desde la última vez que el usuario pidió consultar.
    const [consultas, setConsultas] = useState(0);
    const [intento, setIntento] = useState(0);

    // 401 del backend: la sesión venció o fue revocada; se limpia y se vuelve al login.
    const irAlLoginPorSesionVencida = useCallback(() => {
        clearSession();
        router.replace("/casillero");
    }, [clearSession, router]);

    useEffect(() => {
        let cancelado = false;
        setConsultando(true);
        setError(null);

        fetchPaymentOrder(orderId)
            .then((respuesta) => {
                if (cancelado) return;
                setOrden(respuesta);
                setConsultas((actual) => actual + 1);
            })
            .catch((err) => {
                if (cancelado) return;
                if (isSesionVencidaOrden(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                setError({
                    mensaje: err instanceof Error ? err.message : "No se pudo consultar la orden de pago. Intenta más tarde",
                    noEncontrada: err instanceof CasilleroPaymentOrderError && err.status === 404,
                });
            })
            .finally(() => {
                if (!cancelado) setConsultando(false);
            });

        return () => {
            cancelado = true;
        };
    }, [orderId, intento, irAlLoginPorSesionVencida]);

    const estado = orden ? estadoVisualOrden(orden.status, consultas) : null;

    // Pago en proceso: se vuelve a consultar sola hasta CONSULTAS_AUTOMATICAS veces.
    useEffect(() => {
        if (estado !== "en_proceso" || consultando || error) return;
        const id = setTimeout(() => setIntento((actual) => actual + 1), SEGUNDOS_ENTRE_CONSULTAS * 1000);
        return () => clearTimeout(id);
    }, [estado, consultando, error]);

    const consultarDeNuevo = () => {
        setConsultas(0);
        setIntento((actual) => actual + 1);
    };

    const volverAMultas = (
        <Button variant="outline" onClick={() => router.push(MULTAS)}>
            Volver a Multas
        </Button>
    );

    let contenido;
    if (!orden) {
        contenido = error ? (
            <>
            <Text variant="Medium">{error.mensaje}</Text>
            {error.noEncontrada ? volverAMultas : (
                <Button variant="success" onClick={consultarDeNuevo}>Reintentar</Button>
            )}
            </>
        ) : (
            <LoadingSpinner variant="inline" />
        );
    } else {
        const resumen = (
            <dl className={styles.resumen}>
                <dt>Orden</dt>
                <dd>{orden.id}</dd>
                <dt>Total</dt>
                <dd>Q{orden.totalAmount.toLocaleString("es-GT")}</dd>
            </dl>
        );

        switch (estado) {
            case "creada":
                contenido = (
                    <>
                    <h2 className={styles.titulo}>Orden de pago creada</h2>
                    {resumen}
                    <Text variant="Medium">
                        Falta completar el pago
                        {orden.expiresAt ? ` antes del ${formatearFechaCobro(orden.expiresAt)}` : ""}.
                    </Text>
                    {/* TODO [CASILLERO-BACKEND] (pieza F): botón para pagar con Neonet (checkout). */}
                    {volverAMultas}
                    </>
                );
                break;
            case "en_proceso":
                contenido = (
                    <>
                    <h2 className={styles.titulo}>Pago en proceso</h2>
                    {resumen}
                    <LoadingSpinner variant="inline" />
                    <Text variant="Medium">Estamos confirmando tu pago. No cierres esta página.</Text>
                    </>
                );
                break;
            case "esperar":
                contenido = (
                    <>
                    <h2 className={styles.titulo}>Tu pago aún no se confirma</h2>
                    {resumen}
                    <Text variant="Medium">
                        Puede tardar unos minutos. No vuelvas a pagar: consulta de nuevo más tarde.
                    </Text>
                    <Button variant="success" onClick={consultarDeNuevo} disabled={consultando}>
                        {consultando ? "Consultando..." : "Consultar de nuevo"}
                    </Button>
                    </>
                );
                break;
            case "confirmada":
                contenido = (
                    <>
                    <h2 className={styles.titulo}>Pago confirmado</h2>
                    {resumen}
                    {/* TODO [CASILLERO-BACKEND] (pieza G): descargar el comprobante. */}
                    {volverAMultas}
                    </>
                );
                break;
            default:
                contenido = (
                    <>
                    <h2 className={styles.titulo}>
                        {orden.status === "VENCIDA" ? "La orden de pago venció" : "El pago no se completó"}
                    </h2>
                    {resumen}
                    <Text variant="Medium">No se hizo ningún cobro. Puedes intentar de nuevo desde Multas.</Text>
                    {volverAMultas}
                    </>
                );
        }
    }

    return (
        <>
        <SectionTitle>Estado del pago</SectionTitle>
        <CardGeneral padding="lg" className={styles.card}>
            <div className={styles.estado} aria-live="polite">
                {contenido}
            </div>
        </CardGeneral>
        </>
    );
}

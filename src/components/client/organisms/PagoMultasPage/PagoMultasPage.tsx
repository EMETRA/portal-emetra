"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FinesSummaryCard from "@/components/client/molecules/FinesSummaryCard/FinesSummaryCard";
import CardPaymentForm from "@/components/client/molecules/CardPaymentForm/CardPaymentForm";
import { Text } from "@/components/atoms/Text";
import { createIdempotencyKey } from "@/lib/casillero/api";
import { createPaymentOrder, isSesionVencidaOrden } from "@/lib/casillero/paymentOrders";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "./PagoMultasPage.module.scss";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

export default function PagoMultasPage() {
    const router = useRouter();
    const { selected, clear, total } = useSelectedFinesStore();
    const clearSession = useSessionStore((state) => state.clearSession);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Al crear la orden se limpia la selección; esto evita que el efecto de abajo mande
    // de vuelta a Multas en lugar de ir al estado de la orden.
    const ordenCreada = useRef(false);

    // Misma llave para los reintentos de un mismo pago; cambia si cambian los cobros.
    const llavePago = useRef<{ ids: string; key: string } | null>(null);

    useEffect(() => {
        if (selected.length === 0 && !ordenCreada.current) {
        router.replace("/casillero/dashboard/multas");
        }
    }, [selected, router]);

    // TODO [CASILLERO-BACKEND] (pieza F): los datos de la tarjeta no se envían. Falta saber
    // con Jenny si el pago se hace en la página de Neonet (entonces este formulario sobra)
    // o en el portal; por ahora "Pagar" solo crea la orden.
    const handlePagar = async () => {
        if (loading) return;
        setLoading(true);
        setError("");
        const ids = selected.map((f) => f.id);
        const firma = ids.join(",");
        if (llavePago.current?.ids !== firma) {
            llavePago.current = { ids: firma, key: createIdempotencyKey() };
        }
        try {
            const orden = await createPaymentOrder(ids, llavePago.current.key);
            ordenCreada.current = true;
            clear();
            router.push(`/casillero/dashboard/multas/orden/${encodeURIComponent(orden.id)}`);
        } catch (err) {
            if (isSesionVencidaOrden(err)) {
                clearSession();
                router.replace("/casillero");
                return;
            }
            setError(err instanceof Error ? err.message : "No se pudo crear la orden de pago. Intenta más tarde");
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
        <div className={styles.titleRow}>
            <span className={styles.titleDivider} />
            <h1 className={styles.title}>Resumen de pago</h1>
            <span className={styles.titleDivider} />
        </div>

        {error && (
            <div className={styles.error} role="alert">
                <Text variant="Medium">{error}</Text>
            </div>
        )}

        <div className={styles.content}>
            <FinesSummaryCard fines={selected} total={total()} />
            <CardPaymentForm onPagar={handlePagar} loading={loading} />
        </div>
        </div>
    );
}

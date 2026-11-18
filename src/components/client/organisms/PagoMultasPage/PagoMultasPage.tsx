"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FinesSummaryCard from "@/components/client/molecules/FinesSummaryCard/FinesSummaryCard";
import CardPaymentForm, { type CardPaymentData } from "@/components/client/molecules/CardPaymentForm/CardPaymentForm";
import { Text } from "@/components/atoms/Text";
import { createIdempotencyKey } from "@/lib/casillero/api";
import { createPaymentOrder, isSesionVencidaOrden, startNeoPayCheckout } from "@/lib/casillero/paymentOrders";
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
    const llaveCheckout = useRef<string | null>(null);

    useEffect(() => {
        if (selected.length === 0 && !ordenCreada.current) {
        router.replace("/casillero/dashboard/multas");
        }
    }, [selected, router]);

    const handlePagar = async (cardData: CardPaymentData) => {
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
            const expiry = /^(\d{2})\/(\d{2})$/.exec(cardData.expiracion.trim());
            if (!expiry) throw new Error("Ingresa el vencimiento con formato MM/YY.");
            llaveCheckout.current ??= createIdempotencyKey();
            const checkout = await startNeoPayCheckout(orden.id, {
                card: { number: cardData.numero, expiration: `${expiry[2]}${expiry[1]}`, cvv: cardData.cvv },
                billTo: {
                    firstName: cardData.firstName, lastName: cardData.lastName,
                    addressOne: cardData.addressOne, addressTwo: cardData.addressTwo || undefined,
                    locality: cardData.locality, administrativeArea: cardData.administrativeArea,
                    postalCode: cardData.postalCode, country: cardData.country,
                    email: cardData.email, phoneNumber: cardData.phoneNumber,
                },
            }, llaveCheckout.current);
            ordenCreada.current = true;
            clear();
            router.push(`/casillero/dashboard/multas/orden/${encodeURIComponent(orden.id)}?attempt=${encodeURIComponent(checkout.attemptId)}`);
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

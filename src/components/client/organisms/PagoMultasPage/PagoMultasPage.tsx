"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FinesSummaryCard from "@/components/client/molecules/FinesSummaryCard/FinesSummaryCard";
import CardPaymentForm from "@/components/client/molecules/CardPaymentForm/CardPaymentForm";
import styles from "./PagoMultasPage.module.scss";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";

export default function PagoMultasPage() {
    const router = useRouter();
    const { selected, clear, total } = useSelectedFinesStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selected.length === 0) {
        router.replace("/casillero/dashboard/multas");
        }
    }, [selected, router]);

    const handlePagar = async (data: { nombre: string; numero: string; expiracion: string; cvv: string }) => {
        setLoading(true);
        // TODO: wire to real payment mutation
        console.log("Paying:", selected, data);
        await new Promise((r) => setTimeout(r, 1000));
        clear();
        setLoading(false);
        router.push("/casillero/dashboard");
    };

    return (
        <div className={styles.wrapper}>
        <div className={styles.titleRow}>
            <span className={styles.titleDivider} />
            <h1 className={styles.title}>Resumen de pago</h1>
            <span className={styles.titleDivider} />
        </div>

        <div className={styles.content}>
            <FinesSummaryCard fines={selected} total={total()} />
            <CardPaymentForm onPagar={handlePagar} loading={loading} />
        </div>
        </div>
    );
}
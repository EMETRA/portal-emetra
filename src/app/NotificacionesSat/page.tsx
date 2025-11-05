'use client'
import React, { useState } from 'react';
import classNames from "classnames";
import styles from "./page.module.scss";
import {SatTitle} from '@/components/atoms/index';
import {Button} from '@/components/server/atoms/index';
import { VehicleQueryCard } from '@/components/molecules/index';

const NotificacionesSatPage: React.FC = () => {
    const [plate, setPlate] = useState("C-869BQS");
    const [loading, setLoading] = useState(false);
    const previewPDF = async () => {
        try {
            setLoading(true);
            console.log("Generando PDF para placa:", plate);
            const res = await fetch("/api/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                plate,
                }),
            });

            if (!res.ok) {
                console.error("No se pudo generar el PDF");
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className={classNames(styles.Container)}>
            <SatTitle as="h4" lineColor="#62B44B" lineThickness="2px" gap="5rem">
                Consulta<br/>vehículo
            </SatTitle>
            <VehicleQueryCard
                plate={plate}
                onChange={setPlate}
                onSubmit={previewPDF}
            />
            <div className={styles.Actions}>
                <Button variant="outline" fullWidth className={styles.full}>
                    Pago en línea
                </Button>
                <Button variant="outline" fullWidth className={styles.full}>
                    Obtener Solvencia
                </Button>
                <Button variant="outline" fullWidth className={styles.full}>
                    Predice
                </Button>
            </div>

        </div>
    )
}

export default NotificacionesSatPage;
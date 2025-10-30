'use client'
import React, { useState } from 'react';
import classNames from "classnames";
import styles from "./page.module.scss";
import {SatTitle, Text} from '@/components/atoms/index';
import {Button} from '@/components/server/atoms/index';
import { SatSocialSection, VehicleQueryCard, SatHeader } from '@/components/molecules/index';

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
            <SatHeader
                logoSrc="/images/MuniGuate.png"
                logoAlt="MuniGuate"
                logoHref="/"
                actions={[
                    { label: "1551 Call Center", href: "#", icon: "/icons/callcenter-blue.svg" },
                    { label: "123 CBM",          href: "#", icon: "/icons/firefighters-blue.svg" },
                ]}
            />
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

            <SatTitle as="h4" lineColor="#62B44B" lineThickness="2px" gap="5rem">
                BUSCANOS<br/>MUNIGUATE
            </SatTitle>
            <SatSocialSection />

            <hr className={styles.Separator} />

            <footer className={styles.Footer}>
                <p>21 Calle 6-77 Zona 1, Centro Cívico, Palacio Municipal. Ciudad de Guatemala, Guatemala, Centroamérica.</p>
                <p>PBX 2285-8000</p>
                <p>Powered by I2+D Informática</p>
                <a href="#" className={styles.footerLink}>Términos de Uso</a>
            </footer>

        </div>
    )
}

export default NotificacionesSatPage;
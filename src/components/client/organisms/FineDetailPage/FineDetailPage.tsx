"use client";

import { useState } from "react";
import SatTitle from "@/components/atoms/SatTitle/SatTitle";
import FineDetailHeader from "@/components/client/organisms/FineDetailHeader/FineDetailHeader";
import InfoCard from "@/components/client/molecules/InfoCard/InfoCard";
import EvidenceModal from "@/components/client/organisms/EvidenceModal/EvidenceModal";
import styles from "./FineDetailPage.module.scss";
import { FineDetail } from "@/types/fynesDetail";
import InfoField from "../../atoms/InfoField/InfoField";

// TODO: replace with the real query, e.g. useObtenerDetalleMulta(id)
const fine: FineDetail = {
    series: "N",
    number: "456123",
    category: "transito",
    totalAmount: 500,
    description: "Exceso de Velocidad",
    date: "21 mayo 2026",
    location: "Calzada Roosevelt",
    article: "45",
    numeral: "12",
    evidenceImageUrl: "/images/banner.jpg",
    additionalInfo: {
        conductor: "Daniel Esteban Morales Urizar",
        licencia: "1234567891234",
        tipoLicencia: "C",
    },
    legalInfo: {
        personaNotificada: "Daniel Esteban Morales Urizar",
        fechaImpugnacion: "No registrada",
        ultimaFechaPago: "30 mayo 2026",
    },
    longDescription:
        "El vehículo fue detectado excediendo el límite permitido de velocidad sobre la Calzada Roosevelt en dirección norte, a la altura de la 14 avenida, según registro realizado por agente municipal de tránsito.",
};

export default function FineDetailPage(id: { fineId: string }) {
    console.log("Fine ID:", id.fineId); // TODO: remove after wiring to real data
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <SatTitle>Detalle de Multa</SatTitle>

        <FineDetailHeader
            series={fine.series}
            number={fine.number}
            category={fine.category}
            totalAmount={fine.totalAmount}
            description={fine.description}
            date={fine.date}
            location={fine.location}
            article={fine.article}
            numeral={fine.numeral}
            onVerImagen={() => setIsModalOpen(true)}
        />

        <div className={styles.infoGrid}>
            <InfoCard title="Información Adicional" icon="idCard">
            <InfoField label="Conductor" value={fine.additionalInfo.conductor} />
            <InfoField label="Licencia" value={fine.additionalInfo.licencia} />
            <InfoField label="Tipo de licencia" value={fine.additionalInfo.tipoLicencia} />
            </InfoCard>

            <InfoCard title="Información Legal" icon="legal">
            <InfoField label="Persona notificada" value={fine.legalInfo.personaNotificada} />
            <InfoField label="Fecha de impugnación" value={fine.legalInfo.fechaImpugnacion} />
            <InfoField label="Última fecha de pago" value={fine.legalInfo.ultimaFechaPago} />
            </InfoCard>
        </div>

        <InfoCard title="Descripción" icon="document" className={styles.descriptionCard}>
            <p className={styles.descriptionText}>{fine.longDescription}</p>
        </InfoCard>

        <EvidenceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            imageUrl={fine.evidenceImageUrl}
            onDownloadImage={() => {/* TODO: wire to real download endpoint */}}
            onDownloadNotificacion={() => {/* TODO */}}
            onDownloadRemisionPdf={() => {/* TODO */}}
        />
        </>
    );
}
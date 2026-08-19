import { Solicitud, SolicitudType } from "@/types/solicitudes";

import styles from "./SolicitudCard.module.scss";
import SolicitudStatusBadge from "../../atoms/SolicitudStatusBadge/SolicitudStatusBadge";
import SolicitudIdBadge from "../../atoms/SolicitudIdBagde/SolicitudIdBadge";

const FULL_LABELS: Record<SolicitudType, string> = {
    asociacion: "Solicitud de asociación de placa",
    desasociacion: "Solicitud de desasociación de placa",
};

const SHORT_LABELS: Record<SolicitudType, string> = {
    asociacion: "Solicitud de asociación",
    desasociacion: "Solicitud de desasociación",
};

interface SolicitudCardProps {
    solicitud: Solicitud;
    short?: boolean; 
}

export default function SolicitudCard({ solicitud, short = false }: SolicitudCardProps) {
    const label = short ? SHORT_LABELS[solicitud.type] : FULL_LABELS[solicitud.type];

    return (
        <article className={styles.card}>
        <div className={styles.topRow}>
            <SolicitudIdBadge code={solicitud.code} />
            <span className={styles.date}>{solicitud.date}</span>
        </div>

        <div className={styles.bottomRow}>
            <div className={styles.info}>
            <p className={styles.title}>{label}</p>
            <p className={styles.plate}>Placa: {solicitud.plate}</p>
            </div>
            <SolicitudStatusBadge status={solicitud.status} />
        </div>
        </article>
    );
}
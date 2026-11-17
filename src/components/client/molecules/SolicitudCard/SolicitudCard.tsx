import { Solicitud, SolicitudType } from "@/types/solicitudes";

import styles from "./SolicitudCard.module.scss";
import SolicitudStatusBadge from "../../atoms/SolicitudStatusBadge/SolicitudStatusBadge";
import SolicitudIdBadge from "../../atoms/SolicitudIdBagde/SolicitudIdBadge";

const FULL_LABELS: Record<SolicitudType, string> = {
    empresa: "Solicitud de creación de empresa",
    vehiculo: "Solicitud de asociación de vehículo",
    invitacion: "Invitación para unirse a una empresa",
};

const SHORT_LABELS: Record<SolicitudType, string> = {
    empresa: "Creación de empresa",
    vehiculo: "Asociación de vehículo",
    invitacion: "Invitación empresarial",
};

interface SolicitudCardProps {
    solicitud: Solicitud;
    short?: boolean; 
    onClick?: () => void;
}

export default function SolicitudCard({ solicitud, short = false, onClick }: SolicitudCardProps) {
    const label = short ? SHORT_LABELS[solicitud.type] : FULL_LABELS[solicitud.type];

    return (
        <article
            className={`${styles.card} ${onClick ? styles.clickable : ""}`}
            onClick={onClick}
            onKeyDown={onClick ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick();
                }
            } : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
        <div className={styles.topRow}>
            <SolicitudIdBadge code={solicitud.code} />
            <span className={styles.date}>{solicitud.date}</span>
        </div>

        <div className={styles.bottomRow}>
            <div className={styles.info}>
            <p className={styles.title}>{label}</p>
            <p className={styles.plate}>{solicitud.detail}</p>
            </div>
            <SolicitudStatusBadge status={solicitud.status} label={solicitud.statusLabel} />
        </div>
        </article>
    );
}

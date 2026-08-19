import { SolicitudStatus } from "@/types/solicitudes";
import styles from "./SolicitudStatusBadge.module.scss";

const labels: Record<SolicitudStatus, string> = {
    en_proceso: "En proceso",
    recibido: "Recibido",
    resuelto: "Resuelto",
};

export default function SolicitudStatusBadge({ status }: { status: SolicitudStatus }) {
    return (
        <span className={`${styles.badge} ${styles[status]}`}>
        {labels[status]}
        </span>
    );
}
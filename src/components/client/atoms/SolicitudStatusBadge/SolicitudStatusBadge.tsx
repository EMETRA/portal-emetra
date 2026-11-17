import { SolicitudStatus } from "@/types/solicitudes";
import styles from "./SolicitudStatusBadge.module.scss";

const labels: Record<SolicitudStatus, string> = {
    en_proceso: "En proceso",
    recibido: "Recibido",
    resuelto: "Resuelto",
};

export default function SolicitudStatusBadge({ status, label }: { status: SolicitudStatus; label?: string }) {
    return (
        <span className={`${styles.badge} ${styles[status]}`}>
        {label ?? labels[status]}
        </span>
    );
}

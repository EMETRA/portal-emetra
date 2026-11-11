import Link from "next/link";
import { Button } from "@/components/server/atoms";
import styles from "./CasilleroCompany.module.scss";

const STATUS_LABELS: Record<string, string> = {
    PENDIENTE: "Pendiente",
    APROBADA: "Aprobada",
    RECHAZADA: "Rechazada",
    ACTIVA: "Activa",
    PROPIETARIO: "Propietario",
    MIEMBRO: "Miembro",
    ADMINISTRADOR: "Administrador",
    VIGENTE: "Vigente",
};

export function companyLabel(value: string) {
    return STATUS_LABELS[value] ?? value;
}

export function formatCompanyDate(value: string) {
    return new Intl.DateTimeFormat("es-GT", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function CompanyLoading({ label }: { label: string }) {
    return <p className={styles.status} role="status">{label}</p>;
}

export function CompanyError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className={styles.card}>
            <p className={`${styles.message} ${styles.error}`} role="alert">{message}</p>
            <Button type="button" variant="default" onClick={onRetry}>Reintentar</Button>
        </div>
    );
}

export function CompanyUnauthorized({ message, href, linkLabel }: { message: string; href: string; linkLabel: string }) {
    return (
        <div className={styles.card}>
            <p className={styles.status} role="status">{message}</p>
            <Link href={href}>{linkLabel}</Link>
        </div>
    );
}

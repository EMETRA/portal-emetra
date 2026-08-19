import styles from "./SolicitudIdBadge.module.scss";

export default function SolicitudIdBadge({ code }: { code: string }) {
    return <span className={styles.badge}>{code}</span>;
}
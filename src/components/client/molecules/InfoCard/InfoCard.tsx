import Card from "@/components/atoms/card/Card";
import styles from "./InfoCard.module.scss";
import { JSX } from "react";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";

type InfoCardIcon = "idCard" | "legal" | "document";

const icons: Record<InfoCardIcon, JSX.Element> = {
    idCard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
        <path d="M13 10h6M13 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    legal: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M5 7l-3 6a4 4 0 0 0 6 0l-3-6ZM19 7l-3 6a4 4 0 0 0 6 0l-3-6ZM5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    document: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 2h9l3 3v17H6V2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
};

interface InfoCardProps {
    title: string;
    icon: InfoCardIcon;
    children: React.ReactNode;
    className?: string;
}

export default function InfoCard({ title, icon, children, className }: InfoCardProps) {
    return (
        <CardGeneral className={className}>
        <div className={styles.header}>
            <span className={styles.icon}>{icons[icon]}</span>
            <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.body}>{children}</div>
        </CardGeneral>
    );
}
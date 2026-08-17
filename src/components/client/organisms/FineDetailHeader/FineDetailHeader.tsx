"use client";

import Card from "@/components/atoms/card/Card";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FineCategory } from "@/types/fines";
import styles from "./FineDetailHeader.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import CategoryBadge from "../../atoms/CategoryBadge/CategoryBadge";

interface FineDetailHeaderProps {
    series: string;
    number: string;
    category: FineCategory;
    totalAmount: number;
    description: string;
    date: string;
    location: string;
    article: string;
    numeral: string;
    onVerImagen: () => void;
}

export default function FineDetailHeader({
    series,
    number,
    category,
    totalAmount,
    description,
    date,
    location,
    article,
    numeral,
    onVerImagen,
}: FineDetailHeaderProps) {
    const isMobile = useMediaQuery("(max-width: 520px)");

    return (
        <CardGeneral padding="lg" className={styles.card}>
        {isMobile ? (
            <>
            <h2 className={styles.code}>
                Remisión: {series}{number}
            </h2>

            <div className={styles.mobileBadgeRow}>
                <CategoryBadge category={category} />
                <span className={styles.amount}>Q{totalAmount}</span>
            </div>

            <div className={styles.mobileBody}>
                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>{date}</p>
                <p className={styles.meta}>{location}</p>
                <p className={styles.article}>
                Artículo {article} <span className={styles.dot}>•</span> Numeral {numeral}
                </p>
                <button type="button" className={styles.verImagenButtonMobile} onClick={onVerImagen}>
                Ver imagen
                </button>
            </div>
            </>
        ) : (
            <div className={styles.topGrid}>
            <div className={styles.leftCol}>
                <div className={styles.codeRow}>
                <h2 className={styles.code}>Serie: {series}</h2>
                <h2 className={styles.code}>Número: {number}</h2>
                </div>

                <CategoryBadge category={category} />

                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>
                {date} <span className={styles.dot}>•</span> {location}
                </p>
                <p className={styles.article}>
                Artículo {article} <span className={styles.dot}>•</span> Numeral {numeral}
                </p>
            </div>

            <div className={styles.rightCol}>
                <span className={styles.totalLabel}>Total: Q{totalAmount}</span>
                <button type="button" className={styles.verImagenButton} onClick={onVerImagen}>
                Ver imagen
                </button>
            </div>
            </div>
        )}
        </CardGeneral>
    );
}
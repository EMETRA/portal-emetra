"use client";

import { useEffect, useMemo, useState } from "react";
import PlateCard from "@/components/client/molecules/PlateCard/PlateCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./PlateCardCarousel.module.scss";
import { Plate } from "@/types/plates";

interface PlateCardCarouselProps {
    plates: Plate[];
    onDelete: (plate: Plate) => void;
    onViewDetail: (plate: Plate) => void;
    }

    export default function PlateCardCarousel({
    plates,
    onDelete,
    onViewDetail,
    }: PlateCardCarouselProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1400px)");

    const itemsPerPage = isTablet ? 4 : 3;

    const pages = useMemo(() => {
        if (isMobile) return [plates];
        const chunks: Plate[][] = [];
        for (let i = 0; i < plates.length; i += itemsPerPage) {
        chunks.push(plates.slice(i, i + itemsPerPage));
        }
        return chunks.length > 0 ? chunks : [[]];
    }, [plates, itemsPerPage, isMobile]);

    const totalPages = pages.length;
    const [page, setPage] = useState(0);
    const [skipTransition, setSkipTransition] = useState(false);

    useEffect(() => {
        setSkipTransition(true);
        setPage(0);
        const id = requestAnimationFrame(() => setSkipTransition(false));
        return () => cancelAnimationFrame(id);
    }, [itemsPerPage, plates.length, isMobile]);

    return (
        <div className={styles.carouselWrapper}>
        <div className={styles.wrapper}>
            {!isMobile && (
            <button
                type="button"
                className={styles.arrow}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Anterior"
            >
                ‹
            </button>
            )}

            {isMobile ? (
            <div className={styles.mobileList}>
                {plates.map((plate) => (
                <PlateCard
                    key={plate.id}
                    type={plate.type}
                    number={plate.number}
                    remisiones={plate.remisiones}
                    showDetail={false}
                    onDelete={() => onDelete(plate)}
                    onViewDetail={() => onViewDetail(plate)}
                />
                ))}
            </div>
            ) : (
            <div className={styles.viewport}>
                <div
                className={`${styles.track} ${skipTransition ? styles.noTransition : ""}`}
                style={{ transform: `translateX(-${page * 100}%)` }}
                >
                {pages.map((pagePlates, idx) => (
                    <div className={styles.page} key={idx}>
                    <div className={`${styles.grid} ${isTablet ? styles.gridTablet : ""}`}>
                        {pagePlates.map((plate) => (
                        <PlateCard
                            key={plate.id}
                            type={plate.type}
                            number={plate.number}
                            remisiones={plate.remisiones}
                            onDelete={() => onDelete(plate)}
                            onViewDetail={() => onViewDetail(plate)}
                        />
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            {!isMobile && (
            <button
                type="button"
                className={styles.arrow}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                aria-label="Siguiente"
            >
                ›
            </button>
            )}
        </div>

        {!isMobile && (
            <p className={styles.counter}>
            Mostrando {Math.min((page + 1) * itemsPerPage, plates.length)} de {plates.length}
            </p>
        )}
        </div>
    );
}
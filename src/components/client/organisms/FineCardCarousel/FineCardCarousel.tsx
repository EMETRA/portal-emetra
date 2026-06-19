import { useEffect, useMemo, useState } from "react";
import FineCard from "@/components/client/molecules/FineCard/FineCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Fine } from "@/types/fines";
import styles from "./FineCardCarousel.module.scss";

interface FineCardCarouselProps {
    fines: Fine[];
    onViewDetail?: (id: string) => void;
}

export default function FineCardCarousel({ fines, onViewDetail }: FineCardCarouselProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1400px)");

    const itemsPerPage = isTablet ? 4 : 3;

    const pages = useMemo(() => {
        if (isMobile) return [fines];
        const chunks: Fine[][] = [];
        for (let i = 0; i < fines.length; i += itemsPerPage) {
        chunks.push(fines.slice(i, i + itemsPerPage));
        }
        return chunks.length > 0 ? chunks : [[]];
    }, [fines, itemsPerPage, isMobile]);

    const totalPages = pages.length;

    const [page, setPage] = useState(0);

    // Avoid an animated jump across pages when the breakpoint/itemsPerPage
    // changes (e.g. rotating a tablet) — snap instantly instead of sliding.
    const [skipTransition, setSkipTransition] = useState(false);

    useEffect(() => {
        setSkipTransition(true);
        setPage(0);
        const id = requestAnimationFrame(() => setSkipTransition(false));
        return () => cancelAnimationFrame(id);
    }, [itemsPerPage, fines.length, isMobile]);

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
                    <div className={`${styles.grid} ${styles.gridMobile}`}>
                        {fines.map((fine) => (
                            <FineCard key={fine.id} fine={fine} onViewDetail={onViewDetail} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.viewport}>
                        <div
                            className={`${styles.track} ${skipTransition ? styles.noTransition : ""}`}
                            style={{ transform: `translateX(-${page * 100}%)` }}
                        >
                            {pages.map((pageFines, idx) => (
                                <div className={styles.page} key={idx}>
                                    <div className={styles.grid}>
                                        {pageFines.map((fine) => (
                                            <FineCard key={fine.id} fine={fine} onViewDetail={onViewDetail} />
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

            {/* Counter is now OUTSIDE .wrapper — normal flow, no absolute positioning */}
            {!isMobile && (
                <p className={styles.counter}>
                    Mostrando {Math.min((page + 1) * itemsPerPage, fines.length)} de {fines.length}
                </p>
            )}
        </div>
    );
}
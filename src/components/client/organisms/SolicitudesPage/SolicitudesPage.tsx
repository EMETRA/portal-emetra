"use client";

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SolicitudCard from "@/components/client/molecules/SolicitudCard/SolicitudCard";
import { Solicitud } from "@/types/solicitudes";
import styles from "./SolicitudesPage.module.scss";
import PaginationArrows from "../../atoms/PaginationArrows/PaginationArrows";

// TODO: replace with real query
const MOCK_SOLICITUDES: Solicitud[] = [
    { id: "1", code: "SOL-ID-2101", type: "desasociacion", plate: "P 111BBB", date: "15/05/2026", status: "en_proceso" },
    { id: "2", code: "SOL-ID-2100", type: "asociacion",    plate: "P 111BBB", date: "15/05/2026", status: "recibido" },
    { id: "3", code: "SOL-ID-2099", type: "desasociacion", plate: "P 111BBB", date: "15/05/2026", status: "resuelto" },
    { id: "4", code: "SOL-ID-2098", type: "asociacion",    plate: "P 222CCC", date: "15/05/2026", status: "recibido" },
    { id: "5", code: "SOL-ID-2097", type: "desasociacion", plate: "P 222CCC", date: "15/05/2026", status: "resuelto" },
    { id: "6", code: "SOL-ID-2096", type: "asociacion",    plate: "P 222CCC", date: "15/05/2026", status: "en_proceso" },
    { id: "7", code: "SOL-ID-2095", type: "desasociacion", plate: "P 333DDD", date: "14/05/2026", status: "recibido" },
    { id: "8", code: "SOL-ID-2094", type: "asociacion",    plate: "P 333DDD", date: "14/05/2026", status: "resuelto" },
    { id: "9", code: "SOL-ID-2093", type: "asociacion",    plate: "P 444EEE", date: "13/05/2026", status: "en_proceso" },
    { id: "10", code: "SOL-ID-2092", type: "desasociacion", plate: "P 444EEE", date: "13/05/2026", status: "recibido" },
];

export default function SolicitudesPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1400px)");

    // desktop=4, tablet=5, mobile=6
    const itemsPerPage = isMobile ? 6 : isTablet ? 8 : 5;

    const [page, setPage] = useState(0);
    const totalPages = Math.max(1, Math.ceil(MOCK_SOLICITUDES.length / itemsPerPage));

    // reset to page 0 when breakpoint changes
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const visible = useMemo(
        () => MOCK_SOLICITUDES.slice(page * itemsPerPage, (page + 1) * itemsPerPage),
        [page, itemsPerPage]
    );

    // const start = page * itemsPerPage + 1;
    const end = Math.min((page + 1) * itemsPerPage, MOCK_SOLICITUDES.length);

    return (
        <div className={styles.wrapper}>
        <div className={styles.titleRow}>
            <span className={styles.titleDivider} />
            <h1 className={styles.title}>Mis solicitudes</h1>
            <span className={styles.titleDivider} />
        </div>

        <div className={styles.list}>
            {visible.map((sol) => (
            <SolicitudCard key={sol.id} solicitud={sol} short={isMobile} />
            ))}
        </div>

        <PaginationArrows
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            label={`Mostrando ${end} de ${MOCK_SOLICITUDES.length}`}
        />
        </div>
    );
}
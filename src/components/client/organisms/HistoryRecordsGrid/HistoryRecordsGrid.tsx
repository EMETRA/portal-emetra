"use client";

import { useEffect, useMemo, useState } from "react";
import RecordCard from "@/components/client/molecules/RecordCard/RecordCard";
import { HistoryRecord } from "@/types/historial";
import styles from "./HistoryRecordsGrid.module.scss";
import PaginationArrows from "../../atoms/PaginationArrows/PaginationArrows";

const PAGE_SIZE = 20;
interface Props {
    records: HistoryRecord[];
    onCardClick: (record: HistoryRecord) => void;
}

export default function HistoryRecordsGrid({ records, onCardClick }: Props) {
    const [page, setPage] = useState(0);
    const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));

    useEffect(() => {
        setPage(0);
    }, [records.length]);

    const visibleRecords = useMemo(
        () => records.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
        [records, page]
    );

    return (
        <div>
        <p className={styles.counter}>
            Mostrando {visibleRecords.length} de {records.length} documentos
        </p>

        <div className={styles.grid}>
            {visibleRecords.map((record) => (
                <RecordCard
                    key={record.id}
                    record={record}
                    onClick={() => onCardClick(record)}
                />
            ))}
        </div>

        {records.length > 0 && (
            <PaginationArrows
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                label={`Página ${page + 1} de ${totalPages}`}
            />
        )}
        </div>
    );
}
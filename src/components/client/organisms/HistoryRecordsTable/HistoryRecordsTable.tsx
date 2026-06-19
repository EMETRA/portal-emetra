"use client";

import { useEffect, useMemo, useState } from "react";

import { HistoryRecord } from "@/types/historial";
import styles from "./HistoryRecordsTable.module.scss";
import StatusPill from "../../atoms/StatusPill/StatusPill";
import PaginationArrows from "../../atoms/PaginationArrows/PaginationArrows";

interface HistoryRecordsTableProps {
    records: HistoryRecord[];
    onDownload?: (id: string) => void;
}

const PAGE_SIZE = 20;

export default function HistoryRecordsTable({
    records,
    onDownload,
    }: HistoryRecordsTableProps) {
    const [page, setPage] = useState(0);
    const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));

    useEffect(() => {
        setPage(0);
    }, [records.length]);

    const visibleRecords = useMemo(
        () => records.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
        [records, page]
    );

    const start = page * PAGE_SIZE + 1;
    const end = Math.min((page + 1) * PAGE_SIZE, records.length);

    return (
        <div className={styles.wrapper}>
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Documento</th>
                <th>Estatus</th>
                <th>Monto</th>
                <th>Acción</th>
            </tr>
            </thead>
            <tbody>
            {visibleRecords.map((record) => (
                <tr key={record.id}>
                <td>{record.date}</td>
                <td>{record.code}</td>
                <td>
                    {record.status ? <StatusPill status={record.status} /> : null}
                </td>
                <td>Q{record.amount.toFixed(2)}</td>
                <td>
                    <button
                    type="button"
                    className={styles.downloadLink}
                    onClick={() => onDownload?.(record.id)}
                    >
                    descargar ↓
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {records.length === 0 ? (
            <p className={styles.empty}>No hay documentos para mostrar.</p>
        ) : (
            <PaginationArrows
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                label={`Mostrando ${start}–${end} de ${records.length}`}
            />
        )}
        </div>
    );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import PlateSearchCard from "@/components/client/molecules/PlateSearchCard/PlateSearchCard";
import VehicleSolvencyCard from "@/components/client/molecules/VehicleSolvencyCard/VehicleSolvencyCard";
import HistoryRecordsTable from "@/components/client/organisms/HistoryRecordsTable/HistoryRecordsTable";
import HistoryRecordsGrid from "@/components/client/organisms/HistoryRecordsGrid/HistoryRecordsGrid";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HistoryRecord } from "@/types/historial";
import styles from "./HistorialRemisionesPage.module.scss";
import FilterTabs from "../../atoms/FilterTabs/FilterTabs";
import DateFilterInput from "../../atoms/DateFilterInput/DateFilterInput";
import DownloadConfirmModal from "../../molecules/DownloadConfirmModal/DownloadConfirmModal";
import { fetchPaymentHistory, isSesionVencidaOrden } from "@/lib/casillero/paymentOrders";
import { useSessionStore } from "@/store/useSessionStore";

const vehicle = {
    plate: "P111BBB",
    model: "Toyota corolla",
    color: "Gris",
    year: 2020,
    isSolvente: false,
};

type FilterValue = "todas" | "recibo" | "solvencia";

const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "recibo", label: "Recibos" },
    { value: "solvencia", label: "Solvencias" },
];

export default function HistorialRemisionesPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const clearSession = useSessionStore((state) => state.clearSession);

    const [selectedPlate, setSelectedPlate] = useState(vehicle.plate);
    const [pendingRecord, setPendingRecord] = useState<HistoryRecord | null>(null);
    const [filter, setFilter] = useState<FilterValue>("todas");
    const [dateFilter, setDateFilter] = useState("");
    const [records, setRecords] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        fetchPaymentHistory()
            .then(({ items }) => {
                if (!active) return;
                setRecords(items.map((item) => ({
                    id: item.orderId,
                    type: "recibo" as const,
                    code: item.receiptNumber,
                    date: new Date(item.issuedAt).toLocaleDateString("es-GT"),
                    amount: Number(item.totalAmount),
                })));
            })
            .catch((requestError: unknown) => {
                if (!active) return;
                if (isSesionVencidaOrden(requestError)) clearSession();
                setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el historial.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [clearSession]);

    const filteredRecords = useMemo(() => {
        let result = records;
        if (filter !== "todas") {
            result = result.filter((r) => r.type === filter);
        }
        if (isMobile && dateFilter) {
            const [year, month, day] = dateFilter.split("-");
            const normalized = `${day}/${month}/${year}`;
            result = result.filter((r) => r.date === normalized);
        }
        return result;
    }, [records, filter, dateFilter, isMobile]);

    const handleCardClick = (record: HistoryRecord) => {
        setPendingRecord(record);
    };

    const handleConfirm = () => {
        if (pendingRecord) {
            console.log("Downloading record:", pendingRecord.id);
            // TODO: wire to real download
        }
        setPendingRecord(null);
    };


    return (
        <div className={styles.wrapper}>
            <SectionTitle>Historial de remisiones</SectionTitle>

            <div className={styles.topGrid}>
                <PlateSearchCard
                    options={[{ value: vehicle.plate, label: vehicle.plate }]}
                    selected={selectedPlate}
                    onSelectedChange={setSelectedPlate}
                    onConsultar={() => {}}
                />
                <VehicleSolvencyCard
                    model={vehicle.model}
                    color={vehicle.color}
                    year={vehicle.year}
                    isSolvente={vehicle.isSolvente}
                    onGenerarSolvencia={() => {}}
                />
            </div>

            <div className={styles.listCard}>
                <div className={styles.tabsRow}>
                    <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
                </div>

                {isMobile && (
                    <DateFilterInput value={dateFilter} onChange={setDateFilter} />
                )}

                {loading && <p>Cargando historial...</p>}
                {!loading && error && <p role="alert">{error}</p>}

                {!loading && !error && (isMobile ? (
                    <HistoryRecordsGrid
                        records={filteredRecords}
                        onCardClick={handleCardClick} // <- passes click up from grid
                    />
                ) : (
                    <HistoryRecordsTable
                        records={filteredRecords}
                        onDownload={() => {}}
                    />
                ))}
            </div>

            {/* Modal lives at page level, only reachable from mobile grid */}
            <DownloadConfirmModal
                record={pendingRecord}
                onConfirm={handleConfirm}
                onCancel={() => setPendingRecord(null)}
            />
        </div>
    );
}

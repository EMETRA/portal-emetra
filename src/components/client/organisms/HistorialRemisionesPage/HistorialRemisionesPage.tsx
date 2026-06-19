"use client";

import { useMemo, useState } from "react";
import SatTitle from "@/components/atoms/SatTitle/SatTitle";
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

const vehicle = {
    plate: "P111BBB",
    model: "Toyota corolla",
    color: "Gris",
    year: 2020,
    isSolvente: false,
};

function buildMockRecords(count: number): HistoryRecord[] {
    return Array.from({ length: count }, (_, i) => {
        const isRecibo = i % 3 !== 0;
        if (isRecibo) {
            return { id: String(i + 1), type: "recibo", code: `N51${2650 + i}`, date: "21/05/2026", amount: 500 } as HistoryRecord;
        }
        return { id: String(i + 1), type: "solvencia", code: `${5126480 + i}`, date: "21/05/2026", amount: 25, status: i % 2 === 0 ? "activa" : "inactiva" } as HistoryRecord;
    });
}

const allRecords = buildMockRecords(78);

type FilterValue = "todas" | "recibo" | "solvencia";

const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "recibo", label: "Recibos" },
    { value: "solvencia", label: "Solvencias" },
];

export default function HistorialRemisionesPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [selectedPlate, setSelectedPlate] = useState(vehicle.plate);
    const [pendingRecord, setPendingRecord] = useState<HistoryRecord | null>(null);
    const [filter, setFilter] = useState<FilterValue>("todas");
    const [dateFilter, setDateFilter] = useState("");
    const [pendingId, setPendingId] = useState<string | null>(null); // <- added here

    const filteredRecords = useMemo(() => {
        let result = allRecords;
        if (filter !== "todas") {
            result = result.filter((r) => r.type === filter);
        }
        if (isMobile && dateFilter) {
            const [year, month, day] = dateFilter.split("-");
            const normalized = `${day}/${month}/${year}`;
            result = result.filter((r) => r.date === normalized);
        }
        return result;
    }, [filter, dateFilter, isMobile]);

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
            <SatTitle>Historial de remisiones</SatTitle>

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

                {isMobile ? (
                    <HistoryRecordsGrid
                        records={filteredRecords}
                        onCardClick={handleCardClick} // <- passes click up from grid
                    />
                ) : (
                    <HistoryRecordsTable
                        records={filteredRecords}
                        onDownload={() => {}}
                    />
                )}
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
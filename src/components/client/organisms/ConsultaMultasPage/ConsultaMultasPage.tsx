"use client";

import { useMemo, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import PlateSearchCard from "@/components/client/molecules/PlateSearchCard/PlateSearchCard";
import VehicleSummaryCard from "@/components/client/molecules/VehicleSummaryCard/VehicleSummaryCard";
import FineFilterTabs from "@/components/client/molecules/FineFilterTabs/FineFilterTabs";
import FineCardCarousel from "@/components/client/organisms/FineCardCarousel/FineCardCarousel";
import { Fine, FineCategory, FINE_CATEGORIES } from "@/types/fines";
import styles from "./ConsultaMultasPage.module.scss";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FineListSummaryBar from "../../molecules/FineListSummaryBar/FineListSummaryBar";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import FineSelectionBar from "../../molecules/FineSelectionBar/FineSelectionBar";

// TODO: replace with the real query, e.g. useConsultarMultasPorPlaca
const vehicle = { plate: "P111BBB", model: "Toyota corolla", color: "Gris", year: 2020 };

const fines: Fine[] = [
    { id: "1", code: "N456123", category: "transito", amount: 500, description: "Exceso de velocidad", location: "Calzada Roosevelt", date: "21/05/2026" },
    { id: "2", code: "#787875", category: "administrativo", amount: 500, description: "Exceso de velocidad", location: "Calzada Roosevelt", date: "21/05/2026" },
    { id: "3", code: "#456218", category: "cepo", amount: 500, description: "Estacionado en linea roja", location: "Calzada Roosevelt", date: "21/05/2026" },
    { id: "4", code: "#456218", category: "cepo", amount: 500, description: "Estacionado en linea roja", location: "Calzada Roosevelt", date: "21/05/2026" },
    { id: "5", code: "#456218", category: "cepo", amount: 500, description: "Estacionado en linea roja", location: "Calzada Roosevelt", date: "21/05/2026" },
    { id: "6", code: "#456218", category: "cepo", amount: 500, description: "Estacionado en linea roja", location: "Calzada Roosevelt", date: "21/05/2026" },
    { id: "7", code: "#456218", category: "cepo", amount: 500, description: "Estacionado en linea roja", location: "Calzada Roosevelt", date: "21/05/2026" },

];

export default function ConsultaMultasPage() {
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const searchParams = useSearchParams();
    const preselectedPlate = searchParams.get("plate") ?? vehicle.plate;
    const [filter, setFilter] = useState<"todas" | FineCategory>("todas");
    const [selectedPlate, setSelectedPlate] = useState(preselectedPlate);

    const filteredFines = useMemo(
        () => (filter === "todas" ? fines : fines.filter((f) => f.category === filter)),
        [filter]
    );

    const filteredTotal = useMemo(
        () => filteredFines.reduce((sum, f) => sum + f.amount, 0),
        [filteredFines]
    );

    const amountsByCategory = useMemo(() => {
        const totals = Object.fromEntries(
        FINE_CATEGORIES.map((c) => [c.value, 0])
        ) as Record<FineCategory, number>;
        fines.forEach((f) => {
        totals[f.category] += f.amount;
        });
        return totals;
    }, []);

    const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);

    const handleViewDetail = (fineId: string) => {
        router.push(`/casillero/dashboard/multas/${fineId}`);
    };

return (
    <div className={styles.wrapper}>
        <SectionTitle>Consulta de Multas</SectionTitle>
        <FineSelectionBar />
        <div className={styles.topGrid}>
            <PlateSearchCard
                options={[{ value: vehicle.plate, label: vehicle.plate }]}
                selected={selectedPlate}
                onSelectedChange={setSelectedPlate}
                onConsultar={() => {}}
            />

            <VehicleSummaryCard
                model={vehicle.model}
                color={vehicle.color}
                year={vehicle.year}
                totalAmount={totalAmount}
                pendingCount={fines.length}
                amountsByCategory={amountsByCategory}
            />
        </div>

        <div className={styles.listCard}>
            
            <div className={styles.tabsRow}>
                <FineFilterTabs value={filter} onChange={setFilter} />
            </div>

            {isMobile && (
                <FineListSummaryBar count={filteredFines.length} total={filteredTotal} />
            )}

            <div className={styles.selectionHint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Selecciona las multas que deseas pagar
            </div>
            <div className={styles.carouselSection}>
                <FineCardCarousel fines={filteredFines} onViewDetail={handleViewDetail} />
            </div>
        </div>
    </div>
);
}
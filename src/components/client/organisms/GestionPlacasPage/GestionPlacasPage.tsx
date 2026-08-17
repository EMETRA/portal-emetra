"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import AssociatePlateCard from "@/components/client/molecules/AssociatePlateCard/AssociatePlateCard";
import PlateCardCarousel from "@/components/client/organisms/PlateCardCarousel/PlateCardCarousel";
import DeletePlateModal from "@/components/client/molecules/DeletePlateModal/DeletePlateModal";
import AssociateErrorModal from "@/components/client/molecules/AssociateErrorModal/AssociateErrorModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import styles from "./GestionPlacasPage.module.scss";
import { Plate } from "@/types/plates";
import FilterTabs from "../../atoms/FilterTabs/FilterTabs";
import TextInput from "../../atoms/TextInput/TextInput";

// TODO: replace with real queries
const NIT = "12345678";

const mockPlates: Plate[] = [
    { id: "1", type: "P", number: "111BBB", remisiones: 3 },
    { id: "2", type: "M", number: "111BBB", remisiones: 0 },
    { id: "3", type: "P", number: "111BBB", remisiones: 1 },
    { id: "4", type: "C", number: "111BBB", remisiones: 0 },
    { id: "5", type: "P", number: "111BBB", remisiones: 3 },
];

type FilterValue = "todas" | "con_remisiones" | "sin_remisiones";

const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "con_remisiones", label: "Con remisiones" },
    { value: "sin_remisiones", label: "Sin Remisiones" },
];

export default function GestionPlacasPage() {
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Form state
    const [plateType, setPlateType] = useState("P");
    const [plateNumber, setPlateNumber] = useState("");

    // List state
    const [filter, setFilter] = useState<FilterValue>("todas");
    const [searchText, setSearchText] = useState("");

    // Modal state
    const [deletingPlate, setDeletingPlate] = useState<Plate | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(true);

    const filteredPlates = useMemo(() => {
        let result = mockPlates;

        if (filter === "con_remisiones") {
        result = result.filter((p) => p.remisiones > 0);
        } else if (filter === "sin_remisiones") {
        result = result.filter((p) => p.remisiones === 0);
        }

        if (isMobile && searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        result = result.filter((p) =>
            `${p.type}${p.number}`.toLowerCase().includes(q)
        );
        }

        return result;
    }, [filter, searchText, isMobile]);

    const handleAsociar = () => {
        if (!plateNumber.trim()) return;
        // TODO: call mutation — on error show error modal
        setShowErrorModal(true); // demo: always show error for now
    };

    const handleViewDetail = (plate: Plate) => {
        router.push(
        `/casillero/dashboard/multas?plate=${plate.type}${plate.number}`
        );
    };

    const handleDeleteConfirm = () => {
        // TODO: call mutation to request desasociación
        console.log("Requesting deassociation for:", deletingPlate?.id);
    };

    return (
        <div className={styles.wrapper}>
        <SectionTitle>Gestión de Placas</SectionTitle>

        <AssociatePlateCard
            plateType={plateType}
            plateNumber={plateNumber}
            nit={NIT}
            onPlateTypeChange={setPlateType}
            onPlateNumberChange={setPlateNumber}
            onAsociar={handleAsociar}
        />

        <div className={styles.listCard}>
            <div className={styles.tabsRow}>
            <FilterTabs
                options={filterOptions}
                value={filter}
                onChange={setFilter}
            />
            </div>

            {isMobile && (
            <div className={styles.searchRow}>
                <label className={styles.searchLabel}>Buscar Placa</label>
                <TextInput
                    value={searchText}
                    onChange={setSearchText}
                    placeholder="EJ: P111BBB"
                />
                <p className={styles.plateCount}>
                {filteredPlates.length} Placas asociadas
                </p>
            </div>
            )}

            <PlateCardCarousel
            plates={filteredPlates}
            onDelete={setDeletingPlate}
            onViewDetail={handleViewDetail}
            />
        </div>

        <DeletePlateModal
            plateCode={
            deletingPlate ? `${deletingPlate.type} ${deletingPlate.number}` : null
            }
            onConfirm={handleDeleteConfirm}
            onClose={() => setDeletingPlate(null)}
        />

        <AssociateErrorModal
            isOpen={showErrorModal}
            onClose={() => setShowErrorModal(false)}
            onSend={(message, file) => {
            console.log("Sending:", message, file);
            setShowErrorModal(false);
            // TODO: wire to real email/support mutation
            }}
        />
        </div>
    );
}
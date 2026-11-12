"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import AssociatePlateCard from "@/components/client/molecules/AssociatePlateCard/AssociatePlateCard";
import PlateCardCarousel from "@/components/client/organisms/PlateCardCarousel/PlateCardCarousel";
import AssociateErrorModal from "@/components/client/molecules/AssociateErrorModal/AssociateErrorModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createIdempotencyKey } from "@/lib/casillero/api";
import { useCasilleroProfileStore } from "@/store/useCasilleroProfileStore";
import {
    fetchAllObligations,
    fetchAllVehicles,
    isPeticionCancelada,
    isSesionVencidaCobros,
} from "@/lib/casillero/obligations";
import {
    requestVehicleAssociation,
    requestVehicleAssociationReview,
    VehicleAssociationError,
    type VehicleAssociationRequestCreated,
} from "@/lib/casillero/vehicleAssociations";
import type { CasilleroVehicle } from "@/lib/casillero/types";
import type { Plate } from "@/types/plates";
import FilterTabs from "../../atoms/FilterTabs/FilterTabs";
import TextInput from "../../atoms/TextInput/TextInput";
import styles from "./GestionPlacasPage.module.scss";

type FilterValue = "todas" | "con_remisiones" | "sin_remisiones";

const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "con_remisiones", label: "Con remisiones" },
    { value: "sin_remisiones", label: "Sin Remisiones" },
];

function plateForCard(vehicle: CasilleroVehicle, remisiones: number): Plate {
    return {
        id: vehicle.vehicleReference,
        type: vehicle.plateTypeCode.trim().toUpperCase(),
        number: vehicle.plateNumber.trim().toUpperCase(),
        remisiones,
    };
}

export default function GestionPlacasPage() {
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [plateType, setPlateType] = useState("P");
    const [plateNumber, setPlateNumber] = useState("");
    const [nit, setNit] = useState("No disponible");
    const [plates, setPlates] = useState<Plate[]>([]);
    const [filter, setFilter] = useState<FilterValue>("todas");
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [reviewRequest, setReviewRequest] = useState<VehicleAssociationRequestCreated | null>(null);
    const associationAttempt = useRef<{ fingerprint: string; key: string } | null>(null);
    const reviewAttemptKey = useRef<string | null>(null);

    const loadVehicles = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError("");
        try {
            const [vehicles, profile] = await Promise.all([
                fetchAllVehicles({}, signal),
                useCasilleroProfileStore.getState().load(),
            ]);
            const withCounts = await Promise.all(
                vehicles.map(async (vehicle) => {
                    const obligations = await fetchAllObligations(vehicle.vehicleReference, signal);
                    const remisiones = obligations.filter((obligation) =>
                        obligation.chargeType.toUpperCase().includes("REMISION")
                    ).length;
                    return plateForCard(vehicle, remisiones);
                })
            );
            if (signal?.aborted) return;
            setPlates(withCounts);
            setNit(profile.currentContext?.nit?.trim() || "No disponible");
        } catch (loadError) {
            if (isPeticionCancelada(loadError)) return;
            if (isSesionVencidaCobros(loadError)) {
                router.replace("/casillero");
                return;
            }
            setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar tus placas.");
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const control = new AbortController();
        void loadVehicles(control.signal);
        return () => control.abort();
    }, [loadVehicles]);

    const filteredPlates = useMemo(() => {
        let result = plates;
        if (filter === "con_remisiones") {
            result = result.filter((plate) => plate.remisiones > 0);
        } else if (filter === "sin_remisiones") {
            result = result.filter((plate) => plate.remisiones === 0);
        }
        if (isMobile && searchText.trim()) {
            const query = searchText.trim().toLowerCase();
            result = result.filter((plate) =>
                `${plate.type}${plate.number}`.toLowerCase().includes(query)
            );
        }
        return result;
    }, [filter, isMobile, plates, searchText]);

    const handleAsociar = async () => {
        const input = plateNumber.trim().replace(/\s+/g, "").toUpperCase();
        if (!input || isSubmitting) return;
        const fullPlate = input.startsWith(plateType) ? input : `${plateType}${input}`;
        const fingerprint = `GT:${fullPlate}`;
        if (associationAttempt.current?.fingerprint !== fingerprint) {
            associationAttempt.current = { fingerprint, key: createIdempotencyKey() };
        }

        setIsSubmitting(true);
        setMessage("");
        setError("");
        try {
            const result = await requestVehicleAssociation(fullPlate, associationAttempt.current.key);
            associationAttempt.current = null;
            setPlateNumber("");
            setMessage(
                result.message ||
                `Solicitud ${result.trackingCode} recibida con estado ${result.status}.`
            );
            if (result.canRequestReview) {
                reviewAttemptKey.current = createIdempotencyKey();
                setReviewRequest(result);
            }
            if (result.status === "APPROVED") {
                await loadVehicles();
            }
        } catch (associationError) {
            if (associationError instanceof VehicleAssociationError && associationError.status === 401) {
                router.replace("/casillero");
                return;
            }
            setError(
                associationError instanceof Error
                    ? associationError.message
                    : "No se pudo solicitar la asociación de la placa."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRequestReview = async (reason: string, documents: File[]) => {
        if (!reviewRequest) return;
        reviewAttemptKey.current ??= createIdempotencyKey();
        await requestVehicleAssociationReview(
            reviewRequest.linkRequestId,
            reason,
            documents,
            reviewAttemptKey.current
        );
        reviewAttemptKey.current = null;
        setReviewRequest(null);
        setMessage(`La solicitud ${reviewRequest.trackingCode} quedó pendiente de revisión por un analista.`);
    };

    const handleViewDetail = (plate: Plate) => {
        router.push(`/casillero/dashboard/multas?plate=${encodeURIComponent(`${plate.type}${plate.number}`)}`);
    };

    return (
        <div className={styles.wrapper}>
            <SectionTitle>Gestión de Placas</SectionTitle>

            <AssociatePlateCard
                plateType={plateType}
                plateNumber={plateNumber}
                nit={nit}
                onPlateTypeChange={setPlateType}
                onPlateNumberChange={setPlateNumber}
                onAsociar={handleAsociar}
                isSubmitting={isSubmitting}
            />

            {message && <p role="status" className={styles.successMessage}>{message}</p>}
            {error && <p role="alert" className={styles.errorMessage}>{error}</p>}

            <div className={styles.listCard}>
                <div className={styles.tabsRow}>
                    <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
                </div>

                {isMobile && (
                    <div className={styles.searchRow}>
                        <label className={styles.searchLabel}>Buscar Placa</label>
                        <TextInput value={searchText} onChange={setSearchText} placeholder="EJ: P111BBB" />
                        <p className={styles.plateCount}>{filteredPlates.length} Placas asociadas</p>
                    </div>
                )}

                {isLoading ? (
                    <p className={styles.emptyState}>Cargando tus placas...</p>
                ) : filteredPlates.length === 0 ? (
                    <p className={styles.emptyState}>No tienes placas asociadas para este filtro.</p>
                ) : (
                    <PlateCardCarousel plates={filteredPlates} onViewDetail={handleViewDetail} />
                )}
            </div>

            <AssociateErrorModal
                isOpen={Boolean(reviewRequest)}
                description={reviewRequest?.message}
                onClose={() => {
                    reviewAttemptKey.current = null;
                    setReviewRequest(null);
                }}
                onSend={handleRequestReview}
            />
        </div>
    );
}

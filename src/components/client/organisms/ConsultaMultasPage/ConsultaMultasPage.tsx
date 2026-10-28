"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import PlateSearchCard from "@/components/client/molecules/PlateSearchCard/PlateSearchCard";
import VehicleSummaryCard from "@/components/client/molecules/VehicleSummaryCard/VehicleSummaryCard";
import FineFilterTabs from "@/components/client/molecules/FineFilterTabs/FineFilterTabs";
import FineCardCarousel from "@/components/client/organisms/FineCardCarousel/FineCardCarousel";
import PendienteApi from "@/components/client/atoms/PendienteApi/PendienteApi";
import { Button } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Text } from "@/components/atoms/Text";
import { Fine, FineCategory, FINE_CATEGORIES } from "@/types/fines";
import type { CasilleroVehicle } from "@/lib/casillero/types";
import {
    esCobroPagable,
    fetchAllVehicles,
    fetchObligations,
    isSesionVencidaCobros,
    obligacionAMulta,
    placaCompleta,
} from "@/lib/casillero/obligations";
import { useSessionStore } from "@/store/useSessionStore";
import { useSelectedFinesStore } from "@/store/useSelectedFineStore";
import styles from "./ConsultaMultasPage.module.scss";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FineListSummaryBar from "../../molecules/FineListSummaryBar/FineListSummaryBar";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import FineSelectionBar from "../../molecules/FineSelectionBar/FineSelectionBar";

export default function ConsultaMultasPage() {
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const searchParams = useSearchParams();
    const preselectedPlate = searchParams.get("plate");
    const clearSession = useSessionStore((state) => state.clearSession);
    const clearSelectedFines = useSelectedFinesStore((state) => state.clear);

    const [filter, setFilter] = useState<"todas" | FineCategory>("todas");

    // Vehículos del usuario: el selector usa el vehicleReference como valor.
    const [vehiculos, setVehiculos] = useState<CasilleroVehicle[] | null>(null);
    const [errorVehiculos, setErrorVehiculos] = useState("");
    const [intentoVehiculos, setIntentoVehiculos] = useState(0);
    const [selectedPlate, setSelectedPlate] = useState("");
    const [consultado, setConsultado] = useState<CasilleroVehicle | null>(null);

    // Cobros del vehículo consultado.
    const [fines, setFines] = useState<Fine[]>([]);
    const [cargandoCobros, setCargandoCobros] = useState(false);
    const [errorCobros, setErrorCobros] = useState("");
    const [intentoCobros, setIntentoCobros] = useState(0);

    // 401 del backend: la sesión venció o fue revocada; se limpia y se vuelve al login.
    const irAlLoginPorSesionVencida = useCallback(() => {
        clearSession();
        router.replace("/casillero");
    }, [clearSession, router]);

    useEffect(() => {
        let cancelado = false;
        setErrorVehiculos("");

        fetchAllVehicles()
            .then((lista) => {
                if (cancelado) return;
                setVehiculos(lista);
                // ?plate= preselecciona ese vehículo; si no está, el primero.
                const inicial =
                    lista.find((vehiculo) => placaCompleta(vehiculo) === preselectedPlate) ?? lista[0] ?? null;
                setSelectedPlate(inicial?.vehicleReference ?? "");
                setConsultado(inicial);
            })
            .catch((err) => {
                if (cancelado) return;
                if (isSesionVencidaCobros(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                setErrorVehiculos(err instanceof Error ? err.message : "No se pudieron cargar tus vehículos. Intenta más tarde");
            });

        return () => {
            cancelado = true;
        };
    }, [preselectedPlate, intentoVehiculos, irAlLoginPorSesionVencida]);

    useEffect(() => {
        if (!consultado) return;
        let cancelado = false;
        setCargandoCobros(true);
        setErrorCobros("");

        fetchObligations(consultado.vehicleReference)
            .then((respuesta) => {
                if (!cancelado) setFines(respuesta.items.map(obligacionAMulta));
            })
            .catch((err) => {
                if (cancelado) return;
                if (isSesionVencidaCobros(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                setFines([]);
                setErrorCobros(err instanceof Error ? err.message : "No se pudieron cargar los cobros. Intenta más tarde");
            })
            .finally(() => {
                if (!cancelado) setCargandoCobros(false);
            });

        return () => {
            cancelado = true;
        };
    }, [consultado, intentoCobros, irAlLoginPorSesionVencida]);

    const handleConsultar = () => {
        const vehiculo = vehiculos?.find((v) => v.vehicleReference === selectedPlate);
        if (!vehiculo) return;
        if (vehiculo.vehicleReference === consultado?.vehicleReference) {
            setIntentoCobros((actual) => actual + 1);
            return;
        }
        // Otro vehículo: no se mezclan en el pago cobros seleccionados del anterior.
        clearSelectedFines();
        setFilter("todas");
        setFines([]);
        setConsultado(vehiculo);
    };

    // TODO [CASILLERO-BACKEND]: si la API no manda categorías, filtros y desglose quedan con marca.
    // Sin cobros no se sabe, así que se muestra el desglose en Q0.
    const hayCategorias = fines.length === 0 || fines.some((f) => f.category);

    const filteredFines = useMemo(
        () => (filter === "todas" ? fines : fines.filter((f) => f.category === filter)),
        [fines, filter]
    );

    // Barra de móvil: igual que el resumen, solo cuenta y suma lo que se puede pagar.
    const filteredPayable = useMemo(
        () => filteredFines.filter((f) => esCobroPagable(f.status, f.amount)),
        [filteredFines]
    );

    const filteredTotal = useMemo(
        () => filteredPayable.reduce((sum, f) => sum + f.amount, 0),
        [filteredPayable]
    );

    // Pendientes = lo que se puede pagar (sin lo pagado ni lo que ya está en proceso).
    const pendientes = useMemo(
        () => fines.filter((f) => esCobroPagable(f.status, f.amount)),
        [fines]
    );

    const amountsByCategory = useMemo(() => {
        const totals = Object.fromEntries(
        FINE_CATEGORIES.map((c) => [c.value, 0])
        ) as Record<FineCategory, number>;
        pendientes.forEach((f) => {
        if (f.category) totals[f.category] += f.amount;
        });
        return totals;
    }, [pendientes]);

    const totalAmount = pendientes.reduce((sum, f) => sum + f.amount, 0);

    const handleViewDetail = (fineId: string) => {
        router.push(`/casillero/dashboard/multas/${encodeURIComponent(fineId)}`);
    };

    if (!vehiculos) {
        return (
            <div className={styles.wrapper}>
                <SectionTitle>Consulta de Multas</SectionTitle>
                <div className={styles.estado}>
                    {errorVehiculos ? (
                        <>
                            <Text variant="Medium">{errorVehiculos}</Text>
                            <Button variant="success" onClick={() => setIntentoVehiculos((actual) => actual + 1)}>
                                Reintentar
                            </Button>
                        </>
                    ) : (
                        <LoadingSpinner variant="inline" />
                    )}
                </div>
            </div>
        );
    }

    if (!consultado) {
        return (
            <div className={styles.wrapper}>
                <SectionTitle>Consulta de Multas</SectionTitle>
                <div className={styles.estado}>
                    <Text variant="Medium">No tienes vehículos asociados.</Text>
                </div>
            </div>
        );
    }

return (
    <div className={styles.wrapper}>
        <SectionTitle>Consulta de Multas</SectionTitle>
        <FineSelectionBar />
        <div className={styles.topGrid}>
            <PlateSearchCard
                options={vehiculos.map((v) => ({ value: v.vehicleReference, label: placaCompleta(v) }))}
                selected={selectedPlate}
                onSelectedChange={setSelectedPlate}
                onConsultar={handleConsultar}
            />

            {/* TODO [CASILLERO-BACKEND]: modelo, color y año llegarán con la integración de SAT. */}
            <VehicleSummaryCard
                totalAmount={totalAmount}
                pendingCount={pendientes.length}
                amountsByCategory={hayCategorias ? amountsByCategory : undefined}
            />
        </div>

        <div className={styles.listCard}>

            {cargandoCobros ? (
                <div className={styles.estado}>
                    <LoadingSpinner variant="inline" />
                </div>
            ) : errorCobros ? (
                <div className={styles.estado}>
                    <Text variant="Medium">{errorCobros}</Text>
                    <Button variant="success" onClick={() => setIntentoCobros((actual) => actual + 1)}>
                        Reintentar
                    </Button>
                </div>
            ) : fines.length === 0 ? (
                <div className={styles.estado}>
                    <Text variant="Medium">Este vehículo no tiene multas ni cobros pendientes.</Text>
                </div>
            ) : (
                <>
                    <div className={styles.tabsRow}>
                        <FineFilterTabs value={filter} onChange={setFilter} />
                        {!hayCategorias && <PendienteApi campo="categoría (los filtros no funcionan sin ella)" />}
                    </div>

                    {isMobile && (
                        <FineListSummaryBar count={filteredPayable.length} total={filteredTotal} />
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
                </>
            )}
        </div>
    </div>
);
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import PlateSearchCard from "@/components/client/molecules/PlateSearchCard/PlateSearchCard";
import VehicleSummaryCard from "@/components/client/molecules/VehicleSummaryCard/VehicleSummaryCard";
import FineFilterTabs from "@/components/client/molecules/FineFilterTabs/FineFilterTabs";
import FineCardCarousel from "@/components/client/organisms/FineCardCarousel/FineCardCarousel";
import { Button } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Text } from "@/components/atoms/Text";
import { Fine } from "@/types/fines";
import { categoriasDe } from "@/lib/casillero/categorias";
import type { CasilleroVehicle, CasilleroVehicleDetail } from "@/lib/casillero/types";
import {
    esCobroPagable,
    fetchAllObligations,
    fetchAllVehicles,
    fetchVehicleDetail,
    isPeticionCancelada,
    isSesionVencidaCobros,
    msHastaPrimerVencimiento,
    obligacionAMulta,
    placaCompleta,
} from "@/lib/casillero/obligations";
import { sumarQuetzales } from "@/lib/casillero/montos";
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
    const syncSelectedFines = useSelectedFinesStore((state) => state.sync);

    // "todas" o un tipo de cobro (texto libre de la API).
    const [filter, setFilter] = useState<string>("todas");

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

    // Cada efecto cancela su petición al salir de la pantalla o al volver a pedir; así una
    // respuesta vieja nunca pisa a la nueva y no se siguen pidiendo páginas que ya no sirven.
    useEffect(() => {
        const control = new AbortController();
        setErrorVehiculos("");

        fetchAllVehicles({}, control.signal)
            .then((lista) => {
                if (control.signal.aborted) return;
                setVehiculos(lista);
                // ?plate= preselecciona ese vehículo; si no está, el primero.
                const inicial =
                    lista.find((vehiculo) => placaCompleta(vehiculo) === preselectedPlate) ?? lista[0] ?? null;
                setSelectedPlate(inicial?.vehicleReference ?? "");
                setConsultado(inicial);
            })
            .catch((err) => {
                if (control.signal.aborted || isPeticionCancelada(err)) return;
                if (isSesionVencidaCobros(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                setErrorVehiculos(err instanceof Error ? err.message : "No se pudieron cargar tus vehículos. Intenta más tarde");
            });

        return () => control.abort();
    }, [preselectedPlate, intentoVehiculos, irAlLoginPorSesionVencida]);

    // Marca, modelo, color y año del vehículo consultado. Si falla, la tarjeta muestra la
    // placa y la pantalla sigue (no es necesario para ver ni pagar los cobros).
    const [detalleVehiculo, setDetalleVehiculo] = useState<CasilleroVehicleDetail | null>(null);

    useEffect(() => {
        setDetalleVehiculo(null);
        if (!consultado) return;
        const control = new AbortController();

        fetchVehicleDetail(consultado.vehicleReference, control.signal)
            .then((detalle) => {
                if (!control.signal.aborted) setDetalleVehiculo(detalle);
            })
            .catch((err) => {
                if (control.signal.aborted || isPeticionCancelada(err)) return;
                if (isSesionVencidaCobros(err)) irAlLoginPorSesionVencida();
            });

        return () => control.abort();
    }, [consultado, irAlLoginPorSesionVencida]);

    // true = la próxima consulta de cobros es la automática por vencimiento del monto: no
    // muestra la carga y, si falla, deja los cobros que ya se ven.
    const consultaSilenciosa = useRef(false);

    useEffect(() => {
        if (!consultado) return;
        const control = new AbortController();
        const silenciosa = consultaSilenciosa.current;
        consultaSilenciosa.current = false;
        if (!silenciosa) {
            setCargandoCobros(true);
            setErrorCobros("");
        }

        fetchAllObligations(consultado.vehicleReference, control.signal)
            .then((obligaciones) => {
                if (control.signal.aborted) return;
                const nuevas = obligaciones.map(obligacionAMulta);
                setFines(nuevas);
                // Lo ya seleccionado se actualiza: fuera lo que dejó de ser pagable, monto nuevo.
                syncSelectedFines(nuevas);
            })
            .catch((err) => {
                if (control.signal.aborted || isPeticionCancelada(err)) return;
                if (isSesionVencidaCobros(err)) {
                    irAlLoginPorSesionVencida();
                    return;
                }
                if (silenciosa) return;
                setFines([]);
                setErrorCobros(err instanceof Error ? err.message : "No se pudieron cargar los cobros. Intenta más tarde");
            })
            .finally(() => {
                if (!control.signal.aborted && !silenciosa) setCargandoCobros(false);
            });

        return () => control.abort();
    }, [consultado, intentoCobros, irAlLoginPorSesionVencida, syncSelectedFines]);

    // Cuando vence el monto de algún cobro (validUntil), se vuelve a consultar solo para
    // mostrar y seleccionar el monto vigente.
    useEffect(() => {
        const ms = msHastaPrimerVencimiento(fines);
        if (ms === null) return;
        const timer = setTimeout(() => {
            consultaSilenciosa.current = true;
            setIntentoCobros((actual) => actual + 1);
        }, ms);
        return () => clearTimeout(timer);
    }, [fines]);

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

    // Filtros: uno por cada tipo de cobro que traen los cobros (texto libre de la API).
    const categorias = useMemo(() => categoriasDe(fines), [fines]);

    const filteredFines = useMemo(
        () => (filter === "todas" ? fines : fines.filter((f) => f.category === filter)),
        [fines, filter]
    );

    // Barra de móvil: igual que el resumen, solo cuenta y suma lo que se puede pagar.
    const filteredPayable = useMemo(
        () => filteredFines.filter((f) => esCobroPagable(f)),
        [filteredFines]
    );

    // Las sumas pasan por centavos (sumarQuetzales) para no arrastrar errores de decimales.
    const filteredTotal = useMemo(
        () => sumarQuetzales(filteredPayable.map((f) => f.amount)),
        [filteredPayable]
    );

    // Pendientes = lo que la API marca como pagable.
    const pendientes = useMemo(() => fines.filter((f) => esCobroPagable(f)), [fines]);

    // Desglose de la tarjeta del vehículo: total pendiente por cada tipo de cobro presente.
    const amountsByCategory = useMemo(
        () =>
            categoriasDe(pendientes).map((categoria) => ({
                ...categoria,
                amount: sumarQuetzales(
                    pendientes.filter((f) => f.category === categoria.value).map((f) => f.amount)
                ),
            })),
        [pendientes]
    );

    const totalAmount = useMemo(() => sumarQuetzales(pendientes.map((f) => f.amount)), [pendientes]);

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

            <VehicleSummaryCard
                model={[detalleVehiculo?.make, detalleVehiculo?.model].filter(Boolean).join(" ") || undefined}
                color={detalleVehiculo?.color ?? undefined}
                year={detalleVehiculo?.year ?? undefined}
                totalAmount={totalAmount}
                pendingCount={pendientes.length}
                amountsByCategory={amountsByCategory}
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
                        <FineFilterTabs value={filter} onChange={setFilter} categories={categorias} />
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

"use client";

import { useEffect, useState } from "react";
import CasilleroDashboardCard from "@/components/client/molecules/CasilleroDashboardCard/CasilleroDashboardCard";
import { fetchAllObligations, fetchAllVehicles, isPeticionCancelada } from "@/lib/casillero/obligations";
import { countNewNotifications } from "@/lib/casillero/notifications";
import { useCasilleroProfileStore } from "@/store/useCasilleroProfileStore";
import styles from "./CasilleroDashboardHome.module.scss";

export default function CasilleroDashboardHome() {
  const profile = useCasilleroProfileStore((state) => state.profile);
  const [summary, setSummary] = useState<{ plates: number; pendingRemissions: number } | null>(null);
  const [newNotifications, setNewNotifications] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [vehicles, notificationCount] = await Promise.all([
          fetchAllVehicles({}, controller.signal),
          countNewNotifications(),
        ]);
        const obligations = await Promise.all(vehicles.map((vehicle) => fetchAllObligations(vehicle.vehicleReference, controller.signal)));
        if (controller.signal.aborted) return;
        setSummary({
          plates: vehicles.length,
          pendingRemissions: obligations.flat().filter((obligation) =>
            obligation.chargeType.toUpperCase().includes("REMISION") &&
            obligation.referenceStatus.toUpperCase() !== "PAGADA" &&
            Number(obligation.saldo ?? obligation.totalAmount) > 0
          ).length,
        });
        setNewNotifications(notificationCount);
      } catch (cause) {
        if (!isPeticionCancelada(cause)) setError("No se pudo cargar el resumen. Intenta actualizar la página.");
      }
    };
    void load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refreshNotificationCount = async () => {
      try {
        const total = await countNewNotifications();
        if (!cancelled) setNewNotifications(total);
      } catch {
        // El resumen de vehículos sigue disponible aunque el buzón no responda.
      }
    };
    window.addEventListener("notifications-updated", refreshNotificationCount);
    return () => {
      cancelled = true;
      window.removeEventListener("notifications-updated", refreshNotificationCount);
    };
  }, []);

  const notificationMessage =
    newNotifications === null
      ? "Cargando notificaciones..."
      : newNotifications === 0
        ? "No tienes notificaciones nuevas"
        : newNotifications === 1
          ? "Tienes 1 notificación nueva en tu buzón"
          : `Tienes ${newNotifications} notificaciones nuevas en tu buzón`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.summaryGrid}>
        <CasilleroDashboardCard title={profile ? `¡Hola! ${profile.person.firstName}` : "Información de usuario"} icon="User">
          {error && <p role="alert">{error}</p>}
          {!summary && !error && <p>Cargando resumen...</p>}
          {summary && <><p>Placas asociadas: {summary.plates}</p><p>Remisiones sin pagar: {summary.pendingRemissions}</p></>}
        </CasilleroDashboardCard>

        <CasilleroDashboardCard title="Notificaciones" icon="Notification">
          <h2>{notificationMessage}</h2>
          <a href="/casillero/buzon">ir a buzón +</a>
        </CasilleroDashboardCard>
      </div>

      <CasilleroDashboardCard title="Anuncios" icon="Publicidad" wide>
        <div className={styles.announcementBody} />
      </CasilleroDashboardCard>
    </div>
  );
}

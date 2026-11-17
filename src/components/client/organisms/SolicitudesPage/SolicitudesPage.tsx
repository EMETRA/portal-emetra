"use client";

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SolicitudCard from "@/components/client/molecules/SolicitudCard/SolicitudCard";
import PaginationArrows from "../../atoms/PaginationArrows/PaginationArrows";
import { getCompanyRegistrationRequests, getMyCompanyInvitations, type CompanyRegistrationStatus } from "@/lib/casillero/company";
import { getVehicleAssociationRequests, type VehicleAssociationStatus } from "@/lib/casillero/vehicleAssociations";
import type { Solicitud, SolicitudStatus } from "@/types/solicitudes";
import styles from "./SolicitudesPage.module.scss";

export default function SolicitudesPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1400px)");
  const itemsPerPage = isMobile ? 6 : isTablet ? 8 : 5;
  const [items, setItems] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      getCompanyRegistrationRequests(),
      getVehicleAssociationRequests(),
      getMyCompanyInvitations(),
    ]).then(([companies, vehicles, invitations]) => {
      if (cancelled) return;
      const combined: Solicitud[] = [];
      const failed: string[] = [];

      if (companies.status === "fulfilled") combined.push(...companies.value.map((request) => ({
        id: `company-${request.id}`, code: `EMP-${request.id}`, type: "empresa" as const,
        detail: `${request.razonSocial} · NIT ${request.nit}`, date: formatDate(request.submittedAt),
        occurredAt: request.submittedAt, status: visualCompanyStatus(request.status),
        statusLabel: companyStatusLabel(request.status),
      }))); else failed.push("solicitudes empresariales");

      if (vehicles.status === "fulfilled") combined.push(...vehicles.value.map((request) => ({
        id: `vehicle-${request.linkRequestId}`, code: request.trackingCode, type: "vehiculo" as const,
        detail: `Placa: ${[request.plateTypeCode, request.plateNumber].filter(Boolean).join(" ")}`,
        date: formatDate(request.submittedAt), occurredAt: request.submittedAt,
        status: visualVehicleStatus(request.status), statusLabel: vehicleStatusLabel(request.status),
      }))); else failed.push("solicitudes de vehículos");

      if (invitations.status === "fulfilled") combined.push(...invitations.value.map((invitation) => ({
        id: `invitation-${invitation.invitationId}`, code: `INV-${invitation.invitationId.slice(0, 8)}`,
        type: "invitacion" as const, detail: `${invitation.companyName} · ${invitation.proposedRoleName || invitation.proposedRoleCode || "Miembro"}`,
        date: formatDate(invitation.createdAt), occurredAt: invitation.createdAt,
        status: "recibido" as const, statusLabel: "Pendiente",
      }))); else failed.push("invitaciones empresariales");

      combined.sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
      setItems(combined); setWarnings(failed); setPage(0); setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => setPage(0), [itemsPerPage]);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const visible = useMemo(() => items.slice(page * itemsPerPage, (page + 1) * itemsPerPage), [items, page, itemsPerPage]);
  const end = Math.min((page + 1) * itemsPerPage, items.length);

  return <div className={styles.wrapper}>
    <div className={styles.titleRow}><span className={styles.titleDivider} /><h1 className={styles.title}>Mis solicitudes</h1><span className={styles.titleDivider} /></div>
    {warnings.length ? <p className={styles.warning}>No se pudieron cargar: {warnings.join(", ")}. Los demás resultados sí están disponibles.</p> : null}
    {loading ? <p className={styles.state}>Cargando solicitudes...</p>
    : visible.length === 0 ? <p className={styles.state}>Todavía no tienes solicitudes ni invitaciones.</p>
    : <div className={styles.list}>{visible.map((item) => <SolicitudCard key={item.id} solicitud={item} short={isMobile} />)}</div>}
    {!loading && items.length > 0 ? <PaginationArrows page={page} totalPages={totalPages} onPrev={() => setPage((value) => Math.max(0, value - 1))} onNext={() => setPage((value) => Math.min(totalPages - 1, value + 1))} label={`Mostrando ${end} de ${items.length}`} /> : null}
  </div>;
}

const formatDate = (value: string) => new Intl.DateTimeFormat("es-GT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
const visualCompanyStatus = (status: CompanyRegistrationStatus): SolicitudStatus => status === "APPROVED" || status === "REJECTED" ? "resuelto" : status === "PENDING" ? "recibido" : "en_proceso";
const companyStatusLabel = (status: CompanyRegistrationStatus) => ({ PENDING: "Pendiente", UNDER_REVIEW: "En revisión", OBSERVED: "Observada", APPROVED: "Aprobada", REJECTED: "Rechazada" })[status];
const visualVehicleStatus = (status: VehicleAssociationStatus): SolicitudStatus => status === "APPROVED" || status === "REJECTED" ? "resuelto" : "en_proceso";
const vehicleStatusLabel = (status: VehicleAssociationStatus) => ({ PENDING_SAT: "Validación SAT", APPROVED: "Aprobada", REJECTED: "Rechazada" })[status];

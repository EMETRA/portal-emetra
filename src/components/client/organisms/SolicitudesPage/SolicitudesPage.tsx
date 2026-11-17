"use client";

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SolicitudCard from "@/components/client/molecules/SolicitudCard/SolicitudCard";
import CasilleroPopUp from "@/components/client/molecules/CasilleroPopUp/CasilleroPopUp";
import PaginationArrows from "../../atoms/PaginationArrows/PaginationArrows";
import { getCompanyRegistrationRequest, getCompanyRegistrationRequests, getMyCompanyInvitations, type CompanyRegistrationRequest, type CompanyRegistrationStatus } from "@/lib/casillero/company";
import { getVehicleAssociationRequest, getVehicleAssociationRequests, type VehicleAssociationRequestDetail, type VehicleAssociationStatus } from "@/lib/casillero/vehicleAssociations";
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
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [detail, setDetail] = useState<CompanyRegistrationRequest | VehicleAssociationRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

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
        id: `company-${request.id}`, code: `EMP-${request.id}`, reference: request.id, type: "empresa" as const,
        detail: `${request.razonSocial} · NIT ${request.nit}`, date: formatDate(request.submittedAt),
        occurredAt: request.submittedAt, status: visualCompanyStatus(request.status),
        statusLabel: companyStatusLabel(request.status),
      }))); else failed.push("solicitudes empresariales");

      if (vehicles.status === "fulfilled") combined.push(...vehicles.value.map((request) => ({
        id: `vehicle-${request.linkRequestId}`, code: request.trackingCode, reference: request.trackingCode, type: "vehiculo" as const,
        detail: `Placa: ${[request.plateTypeCode, request.plateNumber].filter(Boolean).join(" ")}`,
        date: formatDate(request.submittedAt), occurredAt: request.submittedAt,
        status: visualVehicleStatus(request.status), statusLabel: vehicleStatusLabel(request.status),
      }))); else failed.push("solicitudes de vehículos");

      if (invitations.status === "fulfilled") combined.push(...invitations.value.map((invitation) => ({
        id: `invitation-${invitation.invitationId}`, code: `INV-${invitation.invitationId.slice(0, 8)}`, reference: invitation.invitationId,
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

  const openDetail = async (item: Solicitud) => {
    if (item.type === "invitacion") return;
    setSelected(item);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      setDetail(item.type === "empresa"
        ? await getCompanyRegistrationRequest(item.reference)
        : await getVehicleAssociationRequest(item.reference));
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "No se pudo cargar el detalle.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetail(null);
    setDetailError("");
  };

  return <>
    <div className={styles.wrapper}>
      <div className={styles.titleRow}><span className={styles.titleDivider} /><h1 className={styles.title}>Mis solicitudes</h1><span className={styles.titleDivider} /></div>
      {warnings.length ? <p className={styles.warning}>No se pudieron cargar: {warnings.join(", ")}. Los demás resultados sí están disponibles.</p> : null}
      {loading ? <p className={styles.state}>Cargando solicitudes...</p>
      : visible.length === 0 ? <p className={styles.state}>Todavía no tienes solicitudes ni invitaciones.</p>
      : <div className={styles.list}>{visible.map((item) => <SolicitudCard key={item.id} solicitud={item} short={isMobile} onClick={item.type === "invitacion" ? undefined : () => openDetail(item)} />)}</div>}
      {!loading && items.length > 0 ? <PaginationArrows page={page} totalPages={totalPages} onPrev={() => setPage((value) => Math.max(0, value - 1))} onNext={() => setPage((value) => Math.min(totalPages - 1, value + 1))} label={`Mostrando ${end} de ${items.length}`} /> : null}
    </div>
    <CasilleroPopUp
      isOpen={selected !== null}
      title={selected?.type === "empresa" ? "Detalle de solicitud empresarial" : "Detalle de asociación de vehículo"}
      description={detailLoading ? "Cargando detalle..." : detailError || "Consulta el estado y la información de tu solicitud."}
      actions={[{ text: "Cerrar", variant: "outline", onClick: closeDetail }]}
      onClose={closeDetail}
    >
      {!detailLoading && !detailError && selected && detail ? <RequestDetail solicitud={selected} detail={detail} /> : null}
    </CasilleroPopUp>
  </>;
}

function RequestDetail({ solicitud, detail }: { solicitud: Solicitud; detail: CompanyRegistrationRequest | VehicleAssociationRequestDetail }) {
  if (solicitud.type === "empresa" && "nit" in detail) {
    return <dl className={styles.detailGrid}>
      <Detail label="Razón social" value={detail.razonSocial} />
      <Detail label="NIT" value={detail.nit} />
      <Detail label="Estado" value={companyStatusLabel(detail.status)} />
      <Detail label="Enviada" value={formatDateTime(detail.submittedAt)} />
      {detail.resolvedAt ? <Detail label="Resuelta" value={formatDateTime(detail.resolvedAt)} /> : null}
      {detail.observation ? <Detail label="Observación" value={detail.observation} wide /> : null}
      <Detail label="Documentos" value={`${detail.documents.length} archivo${detail.documents.length === 1 ? "" : "s"}`} />
    </dl>;
  }

  const vehicle = detail as VehicleAssociationRequestDetail;
  return <dl className={styles.detailGrid}>
    <Detail label="Vehículo" value={solicitud.detail} />
    <Detail label="Código de seguimiento" value={vehicle.trackingCode} />
    <Detail label="Estado" value={vehicleStatusLabel(vehicle.status)} />
    <Detail label="Enviada" value={formatDateTime(vehicle.submittedAt)} />
    {vehicle.resolvedAt ? <Detail label="Resuelta" value={formatDateTime(vehicle.resolvedAt)} /> : null}
    <Detail label="Siguiente paso" value={nextActionLabel(vehicle.nextAction)} />
    {vehicle.message ? <Detail label="Mensaje" value={vehicle.message} wide /> : null}
  </dl>;
}

function Detail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={wide ? styles.detailWide : styles.detailItem}><dt>{label}</dt><dd>{value}</dd></div>;
}

const formatDate = (value: string) => new Intl.DateTimeFormat("es-GT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
const formatDateTime = (value: string) => new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const visualCompanyStatus = (status: CompanyRegistrationStatus): SolicitudStatus => status === "APPROVED" || status === "REJECTED" ? "resuelto" : status === "PENDING" ? "recibido" : "en_proceso";
const companyStatusLabel = (status: CompanyRegistrationStatus) => ({ PENDING: "Pendiente", UNDER_REVIEW: "En revisión", OBSERVED: "Observada", APPROVED: "Aprobada", REJECTED: "Rechazada" })[status];
const visualVehicleStatus = (status: VehicleAssociationStatus): SolicitudStatus => status === "APPROVED" || status === "REJECTED" ? "resuelto" : "en_proceso";
const vehicleStatusLabel = (status: VehicleAssociationStatus) => ({ PENDING_SAT: "Validación SAT", APPROVED: "Aprobada", REJECTED: "Rechazada" })[status];
const nextActionLabel = (action: string) => ({ WAIT_FOR_VALIDATION: "Esperar validación", RETRY_ALLOWED: "Puedes volver a intentarlo", NONE: "Sin acciones pendientes" })[action] ?? action;

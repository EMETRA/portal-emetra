"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button } from "@/components/server/atoms";
import { CasilleroPopUp } from "../../molecules/CasilleroPopUp";
import { acceptCompanyInvitation, getMyCompanyInvitations, rejectCompanyInvitation, type CompanyInvitation } from "@/lib/casillero/company";
import { useCasilleroProfileStore } from "@/store/useCasilleroProfileStore";
import { CompanyError, CompanyLoading, companyLabel, formatCompanyDate } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

export default function CasilleroCompanyInvitations() {
  const router = useRouter();
  const refreshProfile = useCasilleroProfileStore((state) => state.refresh);
  const [invitations, setInvitations] = useState<CompanyInvitation[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ action: "accept" | "reject"; id: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getMyCompanyInvitations().then((items) => {
      if (cancelled) return;
      setInvitations(items); setStatus("ready");
    }).catch((reason: unknown) => {
      if (cancelled) return;
      setError(reason instanceof Error ? reason.message : "No se pudieron cargar las invitaciones."); setStatus("error");
    });
    return () => { cancelled = true; };
  }, [attempt]);

  const runAction = async () => {
    if (!dialog) return;
    setBusyId(dialog.id); setError("");
    try {
      if (dialog.action === "accept") {
        await acceptCompanyInvitation(dialog.id);
        await refreshProfile();
        router.push("/casillero/empresa");
      } else {
        await rejectCompanyInvitation(dialog.id);
        setInvitations((items) => items.filter((item) => item.invitationId !== dialog.id));
      }
      setDialog(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo procesar la invitación.");
    } finally { setBusyId(null); }
  };

  return (
    <div className={styles.wrapper}>
      <SectionTitle>Invitaciones</SectionTitle>
      <CardGeneral className={styles.card} padding="lg">
        {status === "loading" ? <CompanyLoading label="Cargando tus invitaciones..." />
        : status === "error" ? <CompanyError message={error} onRetry={() => setAttempt((value) => value + 1)} />
        : invitations.length === 0 ? <p className={styles.status}>No tienes invitaciones pendientes.</p>
        : <div className={styles.list}>
          {error ? <p className={`${styles.message} ${styles.error}`}>{error}</p> : null}
          {invitations.map((invitation) => (
            <article key={invitation.invitationId} className={styles.invitation}>
              <dl className={styles.details}>
                <div className={styles.detail}><dt>Empresa</dt><dd>{invitation.companyName}</dd></div>
                <div className={styles.detail}><dt>Correo invitado</dt><dd>{invitation.invitedEmail}</dd></div>
                <div className={styles.detail}><dt>Rol propuesto</dt><dd>{companyLabel(invitation.proposedRoleName || invitation.proposedRoleCode || "Sin rol")}</dd></div>
                <div className={styles.detail}><dt>Recibida</dt><dd>{formatCompanyDate(invitation.createdAt)}</dd></div>
                <div className={styles.detail}><dt>Vence</dt><dd>{formatCompanyDate(invitation.expiresAt)}</dd></div>
              </dl>
              <div className={styles.invitationActions}>
                <Button type="button" variant="success" disabled={busyId !== null} onClick={() => setDialog({ action: "accept", id: invitation.invitationId })}>Aceptar</Button>
                <Button type="button" variant="outline" disabled={busyId !== null} onClick={() => setDialog({ action: "reject", id: invitation.invitationId })}>Rechazar</Button>
              </div>
            </article>
          ))}
        </div>}
      </CardGeneral>
      <CasilleroPopUp isOpen={dialog !== null} variant="default" title={`¿Deseas ${dialog?.action === "accept" ? "aceptar" : "rechazar"} esta invitación?`} description="Esta acción actualizará tu acceso empresarial." onClose={() => setDialog(null)} actions={[{ text: "Cancelar", variant: "danger", onClick: () => setDialog(null) }, { text: busyId ? "Procesando..." : "Confirmar", variant: "success", onClick: () => void runAction() }]} />
    </div>
  );
}

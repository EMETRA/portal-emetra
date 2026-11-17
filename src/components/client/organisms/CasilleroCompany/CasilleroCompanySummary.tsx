"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { activateCompanyContext, deactivateCompanyContext, getActiveCompanyContext, getCompanies, getMyCompanyInvitations, type CompanySummary } from "@/lib/casillero/company";
import styles from "./CasilleroCompany.module.scss";

const FIRST_COMPANY_PATH = "/casillero/empresa/solicitud";
const NEW_COMPANY_PATH = "/casillero/empresa/solicitud?new=1";

export default function CasilleroCompanySummaryPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all([getCompanies(), getActiveCompanyContext(), getMyCompanyInvitations()]).then(([items, active, invitations]) => {
      if (cancelled) return;
      setCompanies(items);
      setActiveCompanyId(active);
      setPendingInvitations(invitations.filter((invitation) => invitation.status === "PENDING").length);
      setStatus("ready");
    }).catch((reason: unknown) => {
      if (cancelled) return;
      setError(reason instanceof Error ? reason.message : "No se pudieron cargar tus empresas.");
      setStatus("error");
    });
    return () => { cancelled = true; };
  }, [attempt]);

  const enterCompany = async (company: CompanySummary) => {
    setActivating(company.companyId); setError("");
    try {
      await activateCompanyContext(company.companyId);
      setActiveCompanyId(company.companyId);
      router.push("/casillero/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo entrar a la empresa.");
      setActivating(null);
    }
  };

  const usePersonalContext = async () => {
    await deactivateCompanyContext();
    setActiveCompanyId(null);
    router.refresh();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.companiesHeader}>
        <SectionTitle>Empresas</SectionTitle>
        <div className={styles.companyHeaderActions}>
          <Link className={`${styles.secondaryCompanyButton} ${pendingInvitations > 0 ? styles.invitationsPending : ""}`} href="/casillero/empresa/invitaciones">
            Invitaciones
            {pendingInvitations > 0 ? <span className={styles.invitationBadge} aria-label={`${pendingInvitations} invitaciones pendientes`}>{pendingInvitations}</span> : null}
          </Link>
          {activeCompanyId ? <button className={styles.secondaryCompanyButton} type="button" onClick={() => void usePersonalContext()}>Volver a personal</button> : null}
          {companies.length > 0 ? <Link className={styles.newCompanyButton} href={NEW_COMPANY_PATH}>Nueva empresa +</Link> : null}
        </div>
      </div>

      {status === "loading" ? <p className={styles.status}>Cargando tus empresas...</p>
      : status === "error" ? (
        <div className={styles.centerState}><p className={styles.error}>{error}</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div>
      ) : companies.length === 0 ? (
        <Link className={styles.emptyCompany} href={FIRST_COMPANY_PATH}>
          <span className={styles.emptyCompanyIcon}>+</span>
          <strong>Crear mi primera empresa</strong>
          <span>Registra una empresa y administra sus miembros desde Casillero.</span>
        </Link>
      ) : (
        <div className={styles.companyGrid}>
          {companies.map((company) => <CompanyCard key={company.companyId} company={company} active={activeCompanyId === company.companyId} activating={activating === company.companyId} onEnter={() => void enterCompany(company)} />)}
        </div>
      )}
    </div>
  );
}

function CompanyCard({ company, active, activating, onEnter }: { company: CompanySummary; active: boolean; activating: boolean; onEnter: () => void }) {
  return (
    <div className={styles.companyCardLink}>
      <CardGeneral className={styles.companyCard} padding="lg">
        <div className={styles.companyAvatar}>{company.legalName.trim().charAt(0).toUpperCase()}</div>
        <div className={styles.companyCardBody}>
          <h2>{company.commercialName || company.legalName}</h2>
          <p>NIT: {company.nit}</p>
          <p>{company.registrationStatus}</p>
        </div>
        <div className={styles.companyCardActions}>
          {active ? <span className={styles.activeContext}>Contexto activo</span> : <button type="button" className={styles.enterCompanyButton} onClick={onEnter} disabled={activating}>{activating ? "Entrando..." : "Entrar a empresa"}</button>}
          <Link className={styles.companyDetailLink} href={`/casillero/empresa/${encodeURIComponent(company.companyId)}`}>Ver detalle</Link>
        </div>
      </CardGeneral>
    </div>
  );
}

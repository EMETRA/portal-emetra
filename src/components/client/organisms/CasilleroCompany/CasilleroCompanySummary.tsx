"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { getCompanies, type CompanySummary } from "@/lib/casillero/company";
import styles from "./CasilleroCompany.module.scss";

const FIRST_COMPANY_PATH = "/casillero/empresa/solicitud";
const NEW_COMPANY_PATH = "/casillero/empresa/solicitud?new=1";

export default function CasilleroCompanySummaryPage() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getCompanies().then((items) => {
      if (cancelled) return;
      setCompanies(items);
      setStatus("ready");
    }).catch((reason: unknown) => {
      if (cancelled) return;
      setError(reason instanceof Error ? reason.message : "No se pudieron cargar tus empresas.");
      setStatus("error");
    });
    return () => { cancelled = true; };
  }, [attempt]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.companiesHeader}>
        <SectionTitle>Empresas</SectionTitle>
        <div className={styles.companyHeaderActions}>
          <Link className={styles.secondaryCompanyButton} href="/casillero/empresa/invitaciones">Invitaciones</Link>
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
          {companies.map((company) => <CompanyCard key={company.companyId} company={company} />)}
        </div>
      )}
    </div>
  );
}

function CompanyCard({ company }: { company: CompanySummary }) {
  return (
    <Link className={styles.companyCardLink} href={`/casillero/empresa/${encodeURIComponent(company.companyId)}`}>
      <CardGeneral className={styles.companyCard} padding="lg">
        <div className={styles.companyAvatar}>{company.legalName.trim().charAt(0).toUpperCase()}</div>
        <div className={styles.companyCardBody}>
          <h2>{company.commercialName || company.legalName}</h2>
          <p>NIT: {company.nit}</p>
          <p>{company.registrationStatus}</p>
        </div>
      </CardGeneral>
    </Link>
  );
}

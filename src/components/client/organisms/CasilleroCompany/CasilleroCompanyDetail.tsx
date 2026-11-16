"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import { createCompanyInvitation, getCompany, getCompanyMembers, updateMemberRoles, type CompanyMember, type CompanySummary } from "@/lib/casillero/company";
import { CompanyError, CompanyLoading, companyLabel, formatCompanyDate } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

export default function CasilleroCompanyDetail({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<CompanySummary | null>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    setStatus("loading"); setError("");
    try {
      const [detail, people] = await Promise.all([getCompany(companyId), getCompanyMembers(companyId)]);
      setCompany(detail); setMembers(people); setStatus("ready");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo cargar la empresa."); setStatus("error");
    }
  }, [companyId]);

  useEffect(() => { void load(); }, [load, attempt]);

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(""); setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const roleCode = String(form.get("roleCode") ?? "").trim() || undefined;
    try {
      await createCompanyInvitation(companyId, { email, roleCode });
      setMessage("Invitación enviada correctamente.");
      event.currentTarget.reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo enviar la invitación."); }
  };

  const replaceRoles = async (member: CompanyMember, value: string) => {
    const roleCodes = value.split(",").map((role) => role.trim().toUpperCase()).filter(Boolean);
    setError(""); setMessage("");
    try {
      await updateMemberRoles(companyId, member.membershipId, roleCodes, member.version, "Actualización desde Portal Casillero");
      setMessage("Roles actualizados correctamente.");
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudieron actualizar los roles."); }
  };

  if (status === "loading") return <CompanyLoading label="Cargando empresa..." />;
  if (status === "error" || !company) return <CompanyError message={error || "Empresa no disponible."} onRetry={() => setAttempt((value) => value + 1)} />;

  return (
    <div className={styles.wrapper}>
      <SectionTitle>{company.commercialName || company.legalName}</SectionTitle>
      <div className={styles.layout}>
        <CardGeneral className={styles.card} padding="lg">
          <dl className={styles.details}>
            <div className={styles.detail}><dt>Razón social</dt><dd>{company.legalName}</dd></div>
            <div className={styles.detail}><dt>NIT</dt><dd>{company.nit}</dd></div>
            <div className={styles.detail}><dt>Estado</dt><dd>{companyLabel(company.registrationStatus)}</dd></div>
            <div className={styles.detail}><dt>Miembro desde</dt><dd>{formatCompanyDate(company.membership.validFrom)}</dd></div>
          </dl>
        </CardGeneral>

        <CardGeneral className={styles.card} padding="lg">
          <h2 className={styles.title}>Invitar miembro</h2>
          <form className={styles.formGrid} onSubmit={invite}>
            <label className={styles.field}><span className={styles.label}>Correo</span><Input name="email" type="email" required className={styles.input} /></label>
            <label className={styles.field}><span className={styles.label}>Código de rol (opcional)</span><Input name="roleCode" type="text" placeholder="SECRETARIA" className={styles.input} /></label>
            <Button type="submit" variant="success" className={styles.submit}>Enviar invitación</Button>
          </form>
          {message ? <p className={`${styles.message} ${styles.success}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.error}`}>{error}</p> : null}
        </CardGeneral>

        <CardGeneral className={styles.card} padding="lg">
          <h2 className={styles.title}>Miembros</h2>
          <div className={styles.memberListAlways}>
            {members.map((member) => <MemberEditor key={member.membershipId} member={member} onSave={replaceRoles} />)}
          </div>
        </CardGeneral>
      </div>
    </div>
  );
}

function MemberEditor({ member, onSave }: { member: CompanyMember; onSave: (member: CompanyMember, roles: string) => Promise<void> }) {
  const [roles, setRoles] = useState(member.roles.map((role) => role.code).join(", "));
  return (
    <article className={styles.memberItem}>
      <div className={styles.memberHeader}><div className={styles.memberInfo}><strong>{member.fullName}</strong><span>{member.position || "Sin puesto"}</span></div><span>{companyLabel(member.status)}</span></div>
      <div className={styles.roleEditor}><Input value={roles} onChange={(event) => setRoles(event.target.value)} aria-label={`Roles de ${member.fullName}`} className={styles.input} /><Button type="button" variant="outline" onClick={() => void onSave(member, roles)}>Guardar roles</Button></div>
    </article>
  );
}

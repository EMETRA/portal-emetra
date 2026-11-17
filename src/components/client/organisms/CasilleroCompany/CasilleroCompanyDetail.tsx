"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import { createCompanyInvitation, getCompany, getCompanyMembers, getCompanyRoles, updateMemberRoles, type CompanyMember, type CompanyRole, type CompanySummary } from "@/lib/casillero/company";
import { CompanyError, CompanyLoading, companyLabel, formatCompanyDate } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

export default function CasilleroCompanyDetail({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<CompanySummary | null>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    setStatus("loading"); setError("");
    try {
      const [detail, people, availableRoles] = await Promise.all([getCompany(companyId), getCompanyMembers(companyId), getCompanyRoles()]);
      setCompany(detail); setMembers(people); setRoles(availableRoles); setStatus("ready");
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

  const replaceRoles = async (member: CompanyMember, roleCodes: string[]) => {
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
      <div className={styles.detailNavigation}><Link className={styles.secondaryCompanyButton} href="/casillero/empresa">← Volver a empresas</Link></div>
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
            <label className={styles.field}><span className={styles.label}>Rol (opcional)</span><select name="roleCode" className={styles.select} defaultValue=""><option value="">Sin rol inicial</option>{roles.map((role) => <option key={role.code} value={role.code}>{role.name}</option>)}</select></label>
            <Button type="submit" variant="success" className={styles.submit}>Enviar invitación</Button>
          </form>
          {message ? <p className={`${styles.message} ${styles.success}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.error}`}>{error}</p> : null}
        </CardGeneral>

        <CardGeneral className={styles.card} padding="lg">
          <h2 className={styles.title}>Miembros</h2>
          <div className={styles.memberListAlways}>
            {members.map((member) => <MemberEditor key={member.membershipId} member={member} availableRoles={roles} onSave={replaceRoles} />)}
          </div>
        </CardGeneral>
      </div>
    </div>
  );
}

function MemberEditor({ member, availableRoles, onSave }: { member: CompanyMember; availableRoles: CompanyRole[]; onSave: (member: CompanyMember, roles: string[]) => Promise<void> }) {
  const [selectedRoles, setSelectedRoles] = useState(member.roles.map((role) => role.code));
  return (
    <article className={styles.memberItem}>
      <div className={styles.memberHeader}><div className={styles.memberInfo}><strong>{member.fullName}</strong><span>{member.position || "Sin puesto"}</span></div><span>{companyLabel(member.status)}</span></div>
      <div className={styles.roleEditor}><select multiple value={selectedRoles} onChange={(event) => setSelectedRoles(Array.from(event.currentTarget.selectedOptions, (option) => option.value))} aria-label={`Roles de ${member.fullName}`} className={`${styles.select} ${styles.roleSelect}`}>{availableRoles.map((role) => <option key={role.code} value={role.code}>{role.name}</option>)}</select><Button type="button" variant="outline" onClick={() => void onSave(member, selectedRoles)}>Guardar roles</Button></div>
    </article>
  );
}

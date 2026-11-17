"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import CasilleroPopUp from "@/components/client/molecules/CasilleroPopUp/CasilleroPopUp";
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

  const replaceRoles = async (member: CompanyMember, roleCodes: string[]): Promise<boolean> => {
    setError(""); setMessage("");
    try {
      await updateMemberRoles(companyId, member.membershipId, roleCodes, member.version, "Actualización desde Portal Casillero");
      setMessage("Roles actualizados correctamente.");
      await load();
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudieron actualizar los roles.");
      return false;
    }
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

function MemberEditor({ member, availableRoles, onSave }: { member: CompanyMember; availableRoles: CompanyRole[]; onSave: (member: CompanyMember, roles: string[]) => Promise<boolean> }) {
  const [selectedRoles, setSelectedRoles] = useState(member.roles.map((role) => role.code));
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const openEditor = () => {
    setSelectedRoles(member.roles.map((role) => role.code));
    setIsOpen(true);
  };

  const toggleRole = (code: string) => {
    setSelectedRoles((current) => current.includes(code)
      ? current.filter((role) => role !== code)
      : [...current, code]);
  };

  const save = async () => {
    if (saving) return;
    const hadRepresentative = member.roles.some((role) => role.code === "REPRESENTANTE");
    const keepsRepresentative = selectedRoles.includes("REPRESENTANTE");
    if (hadRepresentative && !keepsRepresentative && !window.confirm("¿Seguro que deseas quitar el rol de Representante legal a este miembro?")) return;
    setSaving(true);
    const saved = await onSave(member, selectedRoles);
    setSaving(false);
    if (saved) setIsOpen(false);
  };

  return <>
    <article className={styles.memberItem}>
      <div className={styles.memberHeader}><div className={styles.memberInfo}><strong>{member.fullName}</strong><span>{member.position || "Sin puesto"}</span></div><span>{companyLabel(member.status)}</span></div>
      <div className={styles.memberRolesRow}>
        <div className={styles.roleChips}>{member.roles.length ? member.roles.map((role) => <span className={styles.roleChip} key={role.code}>{role.name}</span>) : <span className={styles.noRoles}>Sin roles asignados</span>}</div>
        <Button type="button" variant="outline" onClick={openEditor}>Administrar roles</Button>
      </div>
    </article>
    <CasilleroPopUp
      isOpen={isOpen}
      title="Editar roles y permisos"
      description={`Selecciona los roles de ${member.fullName}.`}
      onClose={() => { if (!saving) setIsOpen(false); }}
      actions={[
        { text: "Cancelar", variant: "outline", onClick: () => { if (!saving) setIsOpen(false); } },
        { text: saving ? "Guardando..." : "Guardar cambios", variant: "success", onClick: () => void save() },
      ]}
    >
      <div className={styles.roleChecklist}>
        {availableRoles.map((role) => <label className={styles.roleOption} key={role.code}>
          <input type="checkbox" checked={selectedRoles.includes(role.code)} onChange={() => toggleRole(role.code)} disabled={saving} />
          <span><strong>{role.name}</strong><small>{role.code}</small></span>
        </label>)}
      </div>
    </CasilleroPopUp>
  </>;
}

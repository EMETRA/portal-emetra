"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeaderCell,
} from "@/components/atoms/Table/";
import {
    canOpenCompanySummary,
    companyHomePath,
    getCompanies,
    getCompany,
    getCompanyMembers,
    useCompanyAccess,
    type CompanyDetail,
    type CompanyMember,
} from "@/lib/casillero/company";
import { CompanyError, CompanyLoading, CompanyUnauthorized, companyLabel } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

export default function CasilleroCompanySummary() {
    const { status, access, errorMessage, load } = useCompanyAccess();
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [members, setMembers] = useState<CompanyMember[]>([]);
    const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
    const [detailError, setDetailError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (status !== "ready" || !canOpenCompanySummary(access)) {
            return;
        }

        let cancelled = false;
        setDetailStatus("loading");
        setDetailError("");
        void (async () => {
            try {
                const companies = await getCompanies();
                const summary = companies[0];
                if (!summary) {
                    throw new Error("No tienes una empresa activa.");
                }
                const detail = await getCompany(summary.id);
                const people = detail.rol === "MIEMBRO" ? await getCompanyMembers(detail.id) : [];
                if (cancelled) return;
                setCompany(detail);
                setMembers(people);
                setDetailStatus("ready");
            } catch (error) {
                if (cancelled) return;
                setDetailError(error instanceof Error ? error.message : "No se pudo cargar la empresa.");
                setDetailStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [status, access, attempt]);

    return (
        <div className={styles.wrapper}>
            <SectionTitle>Mi empresa</SectionTitle>
            <div className={styles.layout}>
                <CardGeneral className={styles.card} padding="lg">
                    {status === "loading" || status === "idle" ? (
                        <CompanyLoading label="Cargando tu empresa..." />
                    ) : status === "error" ? (
                        <CompanyError message={errorMessage} onRetry={() => void load()} />
                    ) : !canOpenCompanySummary(access) ? (
                        <CompanyUnauthorized
                            message="Todavía no tienes una empresa activa."
                            href={companyHomePath(access)}
                            linkLabel="Continuar"
                        />
                    ) : detailStatus === "loading" || detailStatus === "idle" ? (
                        <CompanyLoading label="Cargando el resumen de la empresa..." />
                    ) : detailStatus === "error" || !company ? (
                        <CompanyError message={detailError || "No se pudo cargar la empresa."} onRetry={() => setAttempt((current) => current + 1)} />
                    ) : (
                        <dl className={styles.details}>
                            <div className={styles.detail}>
                                <dt>Razón social</dt>
                                <dd>{company.razonSocial}</dd>
                            </div>
                            <div className={styles.detail}>
                                <dt>NIT</dt>
                                <dd>{company.nit}</dd>
                            </div>
                            <div className={styles.detail}>
                                <dt>Estado</dt>
                                <dd>{companyLabel(company.estado)}</dd>
                            </div>
                            <div className={styles.detail}>
                                <dt>Tu rol</dt>
                                <dd>{companyLabel(company.rol)}</dd>
                            </div>
                        </dl>
                    )}
                </CardGeneral>

                {company?.rol === "MIEMBRO" && detailStatus === "ready" ? (
                    <CardGeneral className={styles.card} padding="lg">
                        <h2 className={styles.title}>Miembros</h2>
                        <MemberList members={members} />
                    </CardGeneral>
                ) : null}
            </div>
        </div>
    );
}

function MemberList({ members }: { members: CompanyMember[] }) {
    return (
        <>
            <div className={styles.memberList}>
                {members.map((member) => (
                    <article key={member.id} className={styles.memberItem}>
                        <div className={styles.memberInfo}>
                            <strong>{member.nombre}</strong>
                            <span>{member.correo}</span>
                            <span>{member.roles.map(companyLabel).join(", ")}</span>
                        </div>
                    </article>
                ))}
            </div>
            <div className={styles.tableWrap}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Nombre</TableHeaderCell>
                            <TableHeaderCell>Correo</TableHeaderCell>
                            <TableHeaderCell>Roles</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.nombre}</TableCell>
                                <TableCell>{member.correo}</TableCell>
                                <TableCell>{member.roles.map(companyLabel).join(", ")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

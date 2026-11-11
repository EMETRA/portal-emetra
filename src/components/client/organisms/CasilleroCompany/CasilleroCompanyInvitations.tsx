"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button } from "@/components/server/atoms";
import { CasilleroPopUp } from "../../molecules/CasilleroPopUp";
import {
    acceptCompanyInvitation,
    canOpenInvitations,
    companyHomePath,
    getMyCompanyInvitations,
    rejectCompanyInvitation,
    useCompanyAccess,
    type CompanyInvitation,
} from "@/lib/casillero/company";
import { CompanyError, CompanyLoading, CompanyUnauthorized, companyLabel, formatCompanyDate } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

export default function CasilleroCompanyInvitations() {
    const router = useRouter();
    const { status, access, errorMessage, load } = useCompanyAccess();
    const [invitations, setInvitations] = useState<CompanyInvitation[]>([]);
    const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
    const [detailError, setDetailError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [actionError, setActionError] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [action, setAction] = useState<{ action: "accept" | "reject", id: string }>({ action: "accept", id: "" });

    useEffect(() => {
        if (status !== "ready" || !canOpenInvitations(access)) {
            return;
        }

        let cancelled = false;
        setDetailStatus("loading");
        setDetailError("");
        void getMyCompanyInvitations()
            .then((data) => {
                if (cancelled) return;
                setInvitations(data);
                setDetailStatus("ready");
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                setDetailError(error instanceof Error ? error.message : "No se pudieron cargar las invitaciones.");
                setDetailStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [status, access, attempt]);

    const handleAccept = async (id: string) => {
        setBusyId(id);
        setActionError("");
        try {
            await acceptCompanyInvitation(id);
            router.push("/casillero/empresa");
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "No se pudo aceptar la invitación.");
        } finally {
            setBusyId(null);
        }
    };

    const handleReject = async (id: string) => {
        setBusyId(id);
        setActionError("");
        try {
            await rejectCompanyInvitation(id);
            setInvitations((current) => current.filter((invitation) => invitation.id !== id));
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "No se pudo rechazar la invitación.");
        } finally {
            setBusyId(null);
        }
    };

    const handleOpen = (action: "accept" | "reject", id: string) => {
        setAction({ action, id });
        setIsOpen(true);
    };

    return (
        <div className={styles.wrapper}>
            <SectionTitle>Invitaciones</SectionTitle>
            <CardGeneral className={styles.card} padding="lg">
                {status === "loading" || status === "idle" ? (
                    <CompanyLoading label="Cargando tus invitaciones..." />
                ) : status === "error" ? (
                    <CompanyError message={errorMessage} onRetry={() => void load()} />
                ) : !canOpenInvitations(access) && invitations.length === 0 ? (
                    <CompanyUnauthorized
                        message="No tienes invitaciones pendientes."
                        href={companyHomePath(access)}
                        linkLabel="Volver"
                    />
                ) : detailStatus === "loading" ? (
                    <CompanyLoading label="Cargando tus invitaciones..." />
                ) : detailStatus === "error" ? (
                    <CompanyError message={detailError} onRetry={() => setAttempt((current) => current + 1)} />
                ) : (
                    <div className={styles.list}>
                        {actionError ? <p className={`${styles.message} ${styles.error}`} role="alert">{actionError}</p> : null}
                        {invitations.map((invitation) => (
                            <article key={invitation.id} className={styles.invitation}>
                                <dl className={styles.details}>
                                    <div className={styles.detail}>
                                        <dt>Empresa</dt>
                                        <dd>{invitation.empresa.razonSocial}</dd>
                                    </div>
                                    <div className={styles.detail}>
                                        <dt>NIT</dt>
                                        <dd>{invitation.empresa.nit}</dd>
                                    </div>
                                    <div className={styles.detail}>
                                        <dt>Rol propuesto</dt>
                                        <dd>{companyLabel(invitation.rol)}</dd>
                                    </div>
                                    <div className={styles.detail}>
                                        <dt>Recibida</dt>
                                        <dd>{formatCompanyDate(invitation.invitacionEn)}</dd>
                                    </div>
                                </dl>
                                <div className={styles.invitationActions}>
                                    <Button
                                        type="button"
                                        variant="success"
                                        disabled={busyId !== null}
                                        onClick={() => handleOpen("accept", invitation.id)}
                                    >
                                        {busyId === invitation.id ? "Procesando..." : "Aceptar"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={busyId !== null}
                                        onClick={() => handleOpen("reject", invitation.id)}
                                    >
                                        Rechazar
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </CardGeneral>
            <CasilleroPopUp
                isOpen={isOpen}
                variant="default"
                title={`¿Estás seguro de querer ${action.action === "accept" ? "aceptar" : "rechazar"} esta invitación?`}
                description="Esta acción no se puede deshacer."
                onClose={() => setIsOpen(false)}
                actions={[{
                    text: "Cancelar",
                    variant: "danger",
                    onClick: () => setIsOpen(false),
                }, {
                    text: "Confirmar",
                    variant: "success",
                    onClick: () => {
                        if (action.action === "accept") {
                            void handleAccept(action.id);
                        } else {
                            void handleReject(action.id);
                        }
                       
                    },
                }]}
            />
        </div>
    );
}

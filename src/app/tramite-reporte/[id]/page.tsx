'use client';

import { useParams } from "next/navigation";
import { AlertBadge } from "@/components/molecules/AlertBadge";
import { SectionTitle } from "@/components/server/molecules";
import styles from "./Page.module.scss";
import { Text } from "@/components/atoms";
import { DenunciaDetalleCard } from "@/components/organisms/DenunciaDetalleCard";
import { DenunciaDetalleAcciones } from "@/components/organisms/DenunciaDetalleAcciones";
import { useEffect, useState } from "react";
import { DenunciaDetalleConfirmacion } from "@/components/organisms/DenunciaDetalleConfirmacion";
import { DenunciaConfirmacionCarga } from "@/components/organisms/DenunciaConfirmacionCarga";
import { DenunciaConfirmacionResultado } from "@/components/organisms/DenunciaConfirmacionResultado/DenunciaConfirmacionResultado";
import { Button } from "@/components/server/atoms";
import { CasilleroPopUp } from "@/components/client/molecules/CasilleroPopUp";

// import type { Case, DefenseResponse } from "@/lib/vivi/types";
// import type { Case } from "@/lib/vivi/types";
import type { Case, ConsultaCasoResponse, DefenseResponse } from "@/lib/vivi/types";
// import { submitDefenseClient } from "@/lib/vivi/api";
import { ViviDefenseSent } from "@/components/client/organisms/ViviDefenseSent";

// import { fetchDenunciaByIdClient } from "@/lib/vivi/api";
import { fetchConsultaCaso, PresentarDefensaError, submitDefenseClient } from "@/lib/vivi/api";

const denuncias: Case[] = [
    {
        id: "D-2026-000123",
        codigo: "D-2026-000123",
        usoPlaca: "P",
        placa: "123ABC",
        regla: "1",
        descripcionHecho: "Estacionamiento en linea roja",
        observaciones: "San Salvador",
        estado: "NOTIFICADA",
        denuncia: {
            evidencias: [],
        }
    },
    {
        id: "D-2026-000124",
        codigo: "D-2026-000124",
        usoPlaca: "P",
        placa: "123DEF",
        regla: "1",
        descripcionHecho: "Estacionamiento en linea roja",
        observaciones: "San Miguel",
        estado: "NOTIFICADA",
        denuncia: {
            evidencias: [],
        }
    },
    {
        id: "D-2026-000125",
        codigo: "D-2026-000125",
        usoPlaca: "P",
        placa: "123GHI",
        regla: "1",
        descripcionHecho: "Estacionado en zona roja",
        observaciones: "Guatemala City",
        estado: "NOTIFICADA",
        denuncia: {
            evidencias: [],
        }
    },
    {
        id: "D-2026-000126",
        codigo: "D-2026-000126",
        usoPlaca: "P",
        placa: "123JKL",
        regla: "1",
        descripcionHecho: "Mal estacionamiento. Parqueado a media calle",
        observaciones: "Mixco",
        estado: "NOTIFICADA",
        denuncia: {
            evidencias: [],
        }
    },
]

const remision = "R-2026-004512";

export default function DenunciaPage() {
    const params = useParams<{ id: string }>();
    // const router = useRouter();
    const [denuncia, setDenuncia] = useState<ConsultaCasoResponse | undefined>();
    const [loading, setLoading] = useState(true);
    const [presentandoDefensa, setPresentandoDefensa] = useState(false);
    const [defenseSent, setDefenseSent] = useState<DefenseResponse | undefined>();
    const [submitError, setSubmitError] = useState<{ message: string, isRetried?: boolean } | undefined>();
    const [error, setError] = useState<{ message: string } | undefined>();

    useEffect(() => {
        let cancelled = false;

        async function loadDenuncia() {
            setLoading(true);
            setError(undefined);

            try {
                await new Promise((resolve) => setTimeout(resolve, 5000));
                const data: Case | undefined = denuncias.find((item) => item.codigo === params.id);
                // data = (await fetchDenunciaByIdClient(params.id)) ?? undefined;
                // const data = await fetchConsultaCaso();

                if (!cancelled) {
                    setDenuncia({
                        caso: data,
                        puedePresentarDefensa: true,
                    } as ConsultaCasoResponse);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setDenuncia(undefined);
                    setError({
                        message:
                            loadError instanceof Error && loadError.message
                                ? loadError.message
                                : "No se pudo cargar la denuncia.",
                    });
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadDenuncia();

        return () => {
            cancelled = true;
        };
    }, [params.id]);
    const [vista, setVista] = useState<"detalle" | "confirmacion" | "carga" | "resultado">("detalle");
    const [result, setResult] = useState<"success" | "error">("success");

    const handleAceptarPago = () => {
        setVista("confirmacion");
    }

    // const handlePresentarDefensa = () => {
    const handlePresentarDefensa = async () => {
        setPresentandoDefensa(true);
        setSubmitError(undefined);
        try {
            if (Math.random() > 0.5) {
                throw new Error("No se pudo enviar la defensa.");
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
            setDefenseSent({
                codigoCaso: params.id,
                documento: {
                    estado: "DISPONIBLE",
                    idDefensa: "1234567890",
                    numeroVersion: 1,
                    versionPlantilla: "1.0.0",
                    mime: "application/pdf",
                    tamanoBytes: 1000,
                    sha256: "1234567890",
                    descargar: "https://www.google.com/pdf",
                },
                idDefensa: "1234567890",
                idCaso: "1234567890",
                numeroVersion: 1,
                estado: "DEFENSA_WEB",
                presentadaWebEn: "2026-01-01",
                identidad: "DECLARADA_NO_ACREDITADA",
                idempotente: true,
            });
            // if (denuncia && !denuncia.puedePresentarDefensa) {
            //     throw new Error("Este caso no permite presentar defensa.");
            // }
            // const response = await submitDefenseClient();
            // if (!response?.idDefensa) {
            //     throw new PresentarDefensaError(0, "No se pudo presentar la defensa.");
            // }
            // setDefenseSent(response);
        } catch (submitErr) {
            // const retryable = submitErr instanceof PresentarDefensaError && submitErr.retryable;
            setSubmitError({
                message: submitErr instanceof Error && submitErr.message
                    ? submitErr.message
                    : "No se pudo enviar la defensa.",
                isRetried: Math.random() > 0.5,
                // isRetried: retryable,
            });
        } finally {
            setPresentandoDefensa(false);
        }
    }

    const handleConfirmar = () => {
        setVista("carga");
    }

    const handleVolver = () => {
        setVista("detalle");
    }

    const handleContinuar = () => {
        console.log("continuar");
        alert("Redirección hacia portal muni");
        setVista("detalle");
    }

    const handleReintentar = () => {
        setVista("carga");
    }

    const handleSuccess = () => {
        setVista("resultado");
        setResult("success");
    }

    const handleError = () => {
        setVista("resultado");
        setResult("error");
    }

    

    if (defenseSent) {
        return (
            <div className={styles.main}>
                <ViviDefenseSent {...defenseSent} />
            </div>
        );
    }

    if (!loading && error) {
        return (
            <div className={styles.main}>
                <SectionTitle>Denuncia de tránsito</SectionTitle>
                <Text>{error.message}</Text>
            </div>
        );
    }

    if (!loading && !denuncia) {
        return (
            <div className={styles.main}>
                <SectionTitle>Denuncia de tránsito</SectionTitle>
                <Text>No se encontró la denuncia.</Text>
            </div>
        );
    }

    return (
        <div className={styles.main}>

            {vista === "detalle" || !denuncia ? (
                <>
                    <SectionTitle>Denuncia de tránsito</SectionTitle>
                    <AlertBadge>
                        <Text><b>Abrir este enlace no genera una multa.</b> Revisa la información de la denuncia y decide cómo continuar.</Text>
                    </AlertBadge>

                    <div className={styles.layout}>
                        <DenunciaDetalleCard 
                            denuncia={denuncia?.caso}
                            loading={loading}
                        />
                        <DenunciaDetalleAcciones
                            onAceptarPago={handleAceptarPago}
                            onPresentarDefensa={handlePresentarDefensa}
                            // loading={loading}
                            loading={loading || presentandoDefensa}
                        />
                    </div>
                </>
            ) : vista === "confirmacion" ? (
                <>
                    <SectionTitle>Confirma tu aceptación</SectionTitle>
                    <div className={styles.confirmContainer}>
                        <DenunciaDetalleConfirmacion 
                            denuncia={denuncia.caso}
                            onConfirmar={handleConfirmar}
                            onVolver={handleVolver}
                        />
                    </div>

                    
                </>
            ): vista === "carga" ? (
                <>
                    <div className={styles.confirmContainer}>
                        <DenunciaConfirmacionCarga />
                        <Button
                            onClick={handleSuccess}
                            variant="success"
                        >
                            Success
                        </Button>
                        <Button
                            onClick={handleError}
                            variant="danger"
                        >
                            Error
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.confirmContainer}>
                        <DenunciaConfirmacionResultado 
                            status={result}
                            numeroRemision={remision}
                            denuncia={denuncia.caso}
                            onContinuar={handleContinuar}
                            onReintentar={handleReintentar}
                            onVolver={handleVolver}
                            loading={loading}
                        />
                    </div>
                </>
            )}

            <CasilleroPopUp
                isOpen={!!submitError}
                variant={submitError?.isRetried ? "error" : "default"}
                title="Error al enviar la defensa"
                description={submitError?.message ?? "Ocurrió un error al enviar la defensa."}
                onClose={() => setSubmitError(undefined)}
                actions={[{
                    text: "Reintentar",
                    variant: "default",
                    onClick: handlePresentarDefensa,
                }]}
            />
        </div>
    );

};
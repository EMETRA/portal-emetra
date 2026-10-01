'use client';

import { useParams, useRouter } from "next/navigation";
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

import type { Case } from "@/lib/vivi/types";

// import { fetchDenunciaByIdClient } from "@/lib/vivi/api";

const denuncias: Case[] = [
    {
        caseNumber: "D-2026-000123",
        caseDate: "14/09/2026 10:42",
        place: "San Salvador",
        title: "Estacionamiento en linea roja",
        placa: "P 123ABC",
        denuncia: {
            descripcion: "Estacionamiento en linea roja",
            evidencias: [],
        }
    },
    {
        caseNumber: "D-2026-000124",
        caseDate: "15/09/2026 10:42",
        place: "San Miguel",
        title: "Estacionado en linea roja",
        placa: "P 123DEF",
        denuncia: {
            descripcion: "Estacionamiento en linea roja",
            evidencias: [],
        }
    },
    {
        caseNumber: "D-2026-000125",
        caseDate: "16/09/2026 10:42",
        place: "Guatemala City",
        title: "Estacionado en zona roja",
        placa: "P 123GHI",
        denuncia: {
            descripcion: "Estacionado en zona roja",
            evidencias: [],
        }
    },
    {
        caseNumber: "D-2026-000126",
        caseDate: "17/09/2026 10:42",
        place: "Mixco",
        title: "Mal estacionamiento",
        placa: "P 123JKL",
        denuncia: {
            descripcion: "Mal estacionamiento. Parqueado a media calle",
            evidencias: [],
        }
    },
]

const remision = "R-2026-004512";

export default function DenunciaPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [denuncia, setDenuncia] = useState<Case | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{ message: string } | undefined>();

    useEffect(() => {
        let cancelled = false;

        async function loadDenuncia() {
            setLoading(true);
            setError(undefined);

            try {
                let data: Case | undefined;

                await new Promise((resolve) => setTimeout(resolve, 5000));
                data = denuncias.find((item) => item.caseNumber === params.id);

                // data = (await fetchDenunciaByIdClient(params.id)) ?? undefined;

                if (!cancelled) {
                    setDenuncia(data);
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

    const handlePresentarDefensa = () => {
        router.push(`/tramite-reporte/${params.id}/defensa`);
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
                            denuncia={denuncia}
                            loading={loading}
                        />
                        <DenunciaDetalleAcciones
                            onAceptarPago={handleAceptarPago}
                            onPresentarDefensa={handlePresentarDefensa}
                            loading={loading}
                        />
                    </div>
                </>
            ) : vista === "confirmacion" ? (
                <>
                    <SectionTitle>Confirma tu aceptación</SectionTitle>
                    <div className={styles.confirmContainer}>
                        <DenunciaDetalleConfirmacion 
                            denuncia={denuncia}
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
                            denuncia={denuncia}
                            onContinuar={handleContinuar}
                            onReintentar={handleReintentar}
                            onVolver={handleVolver}
                            loading={loading}
                        />
                    </div>
                </>
            )}

            
        </div>
    );

};
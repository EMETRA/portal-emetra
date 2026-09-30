'use client';

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

const denuncia = {
    numero: "D-2026-000123",
    placa: "P 123ABC",
    hecho: "Estacionamiento en linea roja",
    fechaHora: "14/09/2026 10:42",
    montoBase: 500,
    evidencias: [

    ]
};

const remision = "R-2026-004512";

export default function DenunciaPage() {

    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState<"detalle" | "confirmacion" | "carga" | "resultado">("detalle");
    const [result, setResult] = useState<"success" | "error">("success");

    const handleAceptarPago = () => {
        setVista("confirmacion");
    }

    const handlePresentarDefensa = () => {
        console.log("Se presentará la defensa");
        alert("Redirección a presentar defensa");
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    },[])

    return (
        <div className={styles.main}>

            {vista === "detalle" ? (
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
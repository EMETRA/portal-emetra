"use client";

import { useRef, useState } from "react";
import CardGeneral from "@components/client/atoms/CardGeneral/CardGeneral";
import { Heading } from "@/components/server/atoms";
import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/server/atoms";
import { File } from "@/components/server/atoms/File";
import { Button } from "@/components/server/atoms/Button";
import useMediaQuery from '@mui/material/useMediaQuery';
import { DefenseSentProps } from "./types";
import { descargarPlantilla } from "@/lib/vivi/acciones";

import styles from "./ViviDefenseSent.module.scss";

export default function ViviDefenseSent({ caseNumber, token, onVolver }: DefenseSentProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [loadingPdf, setLoadingPdf] = useState(false);
    const [errorPdf, setErrorPdf] = useState<{ message: string } | null>(null);
    const [pdf, setPdf] = useState(false);

    const enCurso = useRef(false);
    const handleDowloadPdf = async () => {
        if (enCurso.current || !token) return;
        enCurso.current = true;
        setLoadingPdf(true); setErrorPdf(null);
        try {
            const blob = await descargarPlantilla(token);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = `defensa-${caseNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
            document.body.appendChild(link); link.click(); link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            setPdf(true);
        } catch (error) {
            setErrorPdf({ message: error instanceof Error ? error.message : 'No se pudo descargar el PDF. Intenta de nuevo.' });
        } finally { setLoadingPdf(false); enCurso.current = false; }
    }

    return (
        <div className={styles.mainContainer}>
            <CardGeneral className={styles.infoCard} padding={isMobile ? "sm" : "md"}>
                <div className={styles.infoHeader}>
                    <Icon name="Check" color="#1e7a46" width={60} height={60} />
                    <Heading variant="Large" className={styles.title}>Plantilla para presentar tu defensa</Heading>
                    <Text variant="Medium" className={styles.description}>Guarda tu número de caso. Lo necesitarás para presentarte en el juzgado.</Text>
                    <div className={styles.caseNumberContainer}>
                        <Text variant="Medium" className={styles.caseNumberLabel}>Número de caso</Text>
                        <Heading variant="Large" className={styles.caseNumber}>{caseNumber}</Heading>
                    </div>
                </div>
            </CardGeneral>
            <CardGeneral className={styles.pdfCard} padding={isMobile ? "sm" : "md"}>
                <Heading variant="Medium" className={styles.pdfCardTitle}>Tu PDF de defensa</Heading>
                {loadingPdf ? (
                    <div className={styles.loadingPdf}>
                        <Icon name="File" color="#1e7a46" width={60} height={60} />
                        <div className={styles.loadingPdfContent}>
                            <Text variant="Medium" className={styles.loadingPdfTitle}><strong>Estamos generando tu PDF</strong></Text>
                            <Text variant="Small" className={styles.loadingPdfDescription}>Puede tardar unos segundos. Descargar la plantilla no registra una defensa.</Text>
                        </div>
                    </div>
                ) : errorPdf ? (
                    <div className={styles.errorPdf}>
                        <Icon name="Exclamation" className={styles.fileErrorIcon} width={60} height={60} />
                        <div className={styles.errorPdfContent}>
                            <Text variant="Medium" className={styles.errorPdfTitle}><strong>No pudimos generar tu PDF</strong></Text>
                            <Text variant="Small" className={styles.errorPdfDescription}>{errorPdf.message}</Text>
                        </div>
                    </div>
                ) : (
                    <><File className={styles.pdfFile} name={`defensa-${caseNumber}.pdf`} id={`defensa-${caseNumber}`} /><Text variant="Small">{pdf ? "PDF descargado" : "Solicita la plantilla del caso para descargarla."}</Text></>
                )}
                <Button variant="default" className={styles.downloadButton} onClick={handleDowloadPdf} disabled={loadingPdf || !token}>{errorPdf ? "Reintentar descarga" : "Descargar PDF"}</Button>
            </CardGeneral>
            <CardGeneral className={styles.nextSetpsCard} padding={isMobile ? "sm" : "md"}>
                <Heading variant="Medium" className={styles.nextStepsCardTitle}>¿Qué debes de hacer ahora?</Heading>
                <div className={styles.nextStepsContent}>
                    <Text variant="Small" className={styles.nextStepsText}>Imprime y llena el PDF para tu defensa.</Text>
                    <Text variant="Small" className={styles.nextStepsText}>Fírmalo.</Text>
                    <Text variant="Small" className={styles.nextStepsText}>Preséntate en el juzgado indicado con tu número de caso.</Text>
                </div>
                <div className={styles.nextStepsSchedule}>
                    <Text variant="Medium" className={styles.nextStepsText}>Consulta la sede y el horario de atención vigentes del juzgado antes de presentarte.</Text>
                </div>
                <Text variant="Small">Este paso no registra una defensa ni confirma recepción en el juzgado. La presentación es presencial.</Text>
                {onVolver && <Button variant="outline" className={styles.backButton} onClick={onVolver}>Volver al resumen</Button>}
            </CardGeneral>
        </div>
    )
}

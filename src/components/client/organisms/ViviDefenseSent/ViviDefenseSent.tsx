"use client";

import { useState } from "react";
import CardGeneral from "@components/client/atoms/CardGeneral/CardGeneral";
import { Heading } from "@/components/server/atoms";
import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/server/atoms";
import { File } from "@/components/server/atoms/File";
import { Button } from "@/components/server/atoms/Button";
import useMediaQuery from '@mui/material/useMediaQuery';
import { DefenseSentProps } from "./types";

import styles from "./ViviDefenseSent.module.scss";

export default function ViviDefenseSent({ caseNumber, pdfUrl }: DefenseSentProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [loadingPdf, setLoadingPdf] = useState(false);
    const [errorPdf, setErrorPdf] = useState<{ message: string } | null>(null);
    const [pdf, setPdf] = useState(false);

    const handleDowloadPdf = () => {
        setLoadingPdf(true);
        setTimeout(() => {
            if (Math.random() < 0.5) {
                setErrorPdf({ message: "Error al generar tu PDF" });
            } else {
                setPdf(true);
                setLoadingPdf(false);
            }
            setLoadingPdf(false);
        }, 5000);
    }

    return (
        <div className={styles.mainContainer}>
            <CardGeneral className={styles.infoCard} padding={isMobile ? "sm" : "md"}>
                <div className={styles.infoHeader}>
                    <Icon name="Check" color="#1e7a46" width={60} height={60} />
                    <Heading variant="Large" className={styles.title}>Tu defensa fue registrada</Heading>
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
                            <Text variant="Small" className={styles.loadingPdfDescription}>Puede tardar unos segundos. Tu defensa quedó registrada</Text>
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
                    <File className={styles.pdfFile} name={`defensa-${caseNumber}.pdf`} id={`defensa-${caseNumber}`} />
                )}
                <Button variant="default" className={styles.downloadButton} onClick={handleDowloadPdf} disabled={loadingPdf}>Descargar PDF</Button>
            </CardGeneral>
            <CardGeneral className={styles.nextSetpsCard} padding={isMobile ? "sm" : "md"}>
                <Heading variant="Medium" className={styles.nextStepsCardTitle}>¿Qué debes de hacer ahora?</Heading>
                <div className={styles.nextStepsContent}>
                    <Text variant="Small" className={styles.nextStepsText}>Imprime el PDF de tu defensa.</Text>
                    <Text variant="Small" className={styles.nextStepsText}>Fírmalo.</Text>
                    <Text variant="Small" className={styles.nextStepsText}>Preséntate en el juzgado indicado con tu número de caso.</Text>
                </div>
                <div className={styles.nextStepsSchedule}>
                    <Text variant="Medium" className={styles.nextStepsText}>Sede y horario: </Text>
                </div>
            </CardGeneral>
        </div>
    )
}
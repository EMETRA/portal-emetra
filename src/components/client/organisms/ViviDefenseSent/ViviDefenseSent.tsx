"use client";

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

    const handleDowloadPdf = () => {
        alert("Descargando PDF...");
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
                <Heading variant="Medium">Tu PDF de defensa</Heading>
                <File className={styles.pdfFile} name={`defensa-${caseNumber}.pdf`} id={`defensa-${caseNumber}`} />
                <Button variant="default" className={styles.downloadButton} onClick={handleDowloadPdf}>Descargar PDF</Button>
            </CardGeneral>
            <CardGeneral className={styles.nextSetpsCard} padding={isMobile ? "sm" : "md"}>
                <Heading variant="Medium">¿Qué debes de hacer ahora?</Heading>
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
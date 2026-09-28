"use client";

import React, { useState } from 'react'

import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Text } from "@/components/atoms/Text";
import { Chip } from "@/components/server/atoms/Chip";
import { MediaGrid, type MediaGridItem } from "@/components/client/molecules/MediaGrid";
import { Input } from "@/components/server/atoms/Input";
import SelectGeneral from "@/components/client/atoms/SelectGeneral/SelectGeneral";
import { Checkbox } from '@/components/client/atoms/Checkbox';
import { FileUploader } from "@/components/client/molecules/FileUploader";

import useMediaQuery from '@mui/material/useMediaQuery';

import styles from "./ViviDefense.module.scss";
import { Case, DefenseFile, defenseData } from "./types"
import TextArea from '@/components/server/atoms/TextArea/TextArea';
import { Button } from '@/components/server/atoms/Button';


const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov"];

const getExtension = (value: string) => {
    const filename = value.split("?")[0].split("/").pop() ?? value;
    const ext = filename.includes(".") ? filename.split(".").pop() : "";
    return ext?.toLowerCase() ?? "";
};

const toMediaGridItem = (file: DefenseFile): MediaGridItem => {
    const ext = getExtension(file.name) || getExtension(file.sourceUrl);

    if (IMAGE_EXTENSIONS.includes(ext)) {
        return {
            type: "image",
            src: file.sourceUrl,
            alt: file.name,
            width: 320,
            height: 180,
        };
    }

    if (VIDEO_EXTENSIONS.includes(ext)) {
        return {
            type: "video",
            src: file.sourceUrl,
        };
    }

    return {
        type: "file",
        id: file.id,
        name: file.name,
        download: true,
        onClick: () => {
            alert(`Descargar archivo id: ${file.id}`);
        },
    };
};

export default function ViviDefense({ caseData }: { caseData: Case }) {
    const [defenseData, setDefenseData] = useState<defenseData>({
        name: "",
        personalDocumentType: "dpi",
        dpi: "",
        passport: "",
        email: "",
        phone: "",
        arguments: "",
        attachments: [],
        declaration: false,
    });

    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleFileUpload = (files: File[]) => {
        console.log(files);
    }

    const renderCaseInfo = (key: string, value: string) => {
        return (
        <div className={styles.caseInfoItem}>
            <Text className={styles.caseInfoItemTitle} variant="Medium">{key}</Text>
            <Text className={styles.caseInfoItemValue} variant="Large"><strong>{value}</strong></Text>
        </div>
        )
    }

    const handleSubmit = () => {
        console.log(defenseData);
    }

    const handleCancel = () => {
        console.log("Cancelar");
    }

    return (
        <div className={styles.mainContainer}>
            <SectionTitle>Presentar defensa</SectionTitle>
            <div className={styles.defenseContainer}>
                <CardGeneral className={styles.caseInfoCard} padding={isMobile ? "sm" : "md"}>
                    <div className={styles.caseInfoHeader}>
                        <Text variant="Large" className={styles.caseInfoTitle}><strong>Denuncia y evidencias originales</strong></Text>
                        <Chip label="Solo lectura" backgroundColor="#E8E9F3" color="#000000"/>
                    </div>
                    <div className={styles.caseInfoItems}>
                        {renderCaseInfo("Número de denuncia", caseData.caseNumber)}
                        {renderCaseInfo("Placa", caseData.placa)}
                        {renderCaseInfo("Fecha y hora", caseData.caseDate)}
                        {renderCaseInfo("Hecho denunciado", caseData.denuncia.descripción)}
                    </div>
                    <MediaGrid items={caseData.denuncia.evidencias.map(toMediaGridItem)} columns={isMobile ? 2 : 3} />
                </CardGeneral>
                <CardGeneral className={styles.defenseDataCard} padding={isMobile ? "sm" : "md"}>
                    <Text variant="Large" className={styles.defenseDataTitle}><strong>Tus datos</strong></Text>
                    <Text variant="Medium" className={styles.defenseDataDescription}>Identidad declarada de quien presenta la defensa</Text>
                    <label className={styles.field} htmlFor="name">
                        <span className={styles.label}>Nombre completo</span>
                        <Input
                        className={styles.input}
                        id="name"
                        type="text"
                        value={defenseData.name}
                        placeholder="Ingresa tu nombre"
                        onChange={(event) => setDefenseData({ ...defenseData, name: event.target.value })}
                        required
                        />
                    </label>
                    <label className={styles.field} htmlFor="personalDocumentType">
                        <span className={styles.label}>Tipo de documento</span>
                        <SelectGeneral
                            options={[{ value: "dpi", label: "DPI" }, { value: "passport", label: "Pasaporte" }]}
                            value={defenseData.personalDocumentType}
                            onChange={(value) => setDefenseData({ ...defenseData, personalDocumentType: value as "dpi" | "passport" })}
                        />
                    </label>
                    <label className={styles.field} htmlFor={defenseData.personalDocumentType === "dpi" ? "dpi" : "passport"}>
                        <span className={styles.label}>Documento de identificación</span>
                        <Input
                        className={styles.input}
                        id={defenseData.personalDocumentType === "dpi" ? "dpi" : "passport"}
                        type="text"
                        value={defenseData.personalDocumentType === "dpi" ? defenseData.dpi : defenseData.passport}
                        placeholder="Ingresa tu número de DPI"
                        onChange={(event) => setDefenseData({ ...defenseData, [defenseData.personalDocumentType === "dpi" ? "dpi" : "passport"]: event.target.value })}
                        required
                        />
                    </label>
                    <label className={styles.field} htmlFor="email">
                        <span className={styles.label}>Correo electrónico</span>
                        <Input
                        className={styles.input}
                        id="email"
                        type="email"
                        value={defenseData.email}
                        placeholder="Ingresa tu correo electrónico"
                        onChange={(event) => setDefenseData({ ...defenseData, email: event.target.value })}
                        required
                        />
                    </label>
                    <label className={styles.field} htmlFor="phone">
                        <span className={styles.label}>Teléfono de contacto</span>
                        <Input
                        className={styles.input}
                        id="phone"
                        type="tel"
                        value={defenseData.phone}
                        placeholder="Ingresa tu teléfono"
                        onChange={(event) => setDefenseData({ ...defenseData, phone: event.target.value })}
                        required
                        />
                    </label>
                </CardGeneral>
                <CardGeneral className={styles.defenseDataCard} padding={isMobile ? "sm" : "md"}>
                    <Text variant="Large" className={styles.defenseDataTitle}><strong>Tus argumentos</strong></Text>
                    <label className={styles.field} htmlFor="arguments">
                        <span className={styles.label}>Explica por qué no estás de acuerdo</span>
                        <TextArea
                        className={styles.textArea}
                        id="arguments"
                        value={defenseData.arguments}
                        placeholder="Escribe aquí los argumentos de tu defensa"
                        onChange={(event) => setDefenseData({ ...defenseData, arguments: event.target.value })}
                        required
                        />
                    </label>
                </CardGeneral>
                <CardGeneral className={styles.attachmentsCard} padding={isMobile ? "sm" : "md"}>
                    <Text variant="Large" className={styles.attachmentsTitle}><strong>Anexos de defensa</strong></Text>
                    <Text variant="Medium" className={styles.attachmentsDescription}>Tus anexos de defensa se guardan por separado de las evidencias originales de la denuncia. Requisitos: Imágenes en JPG, PNG o GIF, video en MP4. El total de todos los archivos no puede superar 20 MB.</Text>
                    <FileUploader
                        accept={["image/jpeg", "image/png", "image/gif", "video/mp4", ".jpg", ".jpeg", ".png", ".gif", ".mp4"]}
                        maxSizeBytes={20 * 1024 * 1024}
                        maxTotalSizeBytes={20 * 1024 * 1024}
                        maxFiles={10}
                        onChange={handleFileUpload}
                    />
                </CardGeneral>
                <Checkbox
                    key="declaration"
                    checked={defenseData.declaration}
                    onChange={(event) => setDefenseData({ ...defenseData, declaration: event.target.checked })}
                    label='Declaro que la información y los archivos que presento son verdaderos. Esta información es autodeclarada y EMETRA puede verificarla más adelante.'
                />
                <div className={styles.actionsContainer}>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                    >
                        Enviar defensa
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    )
}
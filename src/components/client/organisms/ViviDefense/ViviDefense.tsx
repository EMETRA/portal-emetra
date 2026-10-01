"use client";

import React, { useEffect, useState } from 'react'

import { LoadingSpinner } from '@/components/server/atoms/LoadingSpinner';
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
import { useRouter } from 'next/navigation';
import { defenseAttachmentAccept, defenseAttachmentMaxBytes, defenseAttachmentMaxFiles, defenseSchema } from "@/schema/vivi";

// import { fetchDenunciaByIdClient, submitDefenseClient } from "@/lib/vivi/api";


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

const denuncias: Case[] = [
    {
        caseNumber: "D-2026-000123",
        caseDate: "14/09/2026 10:42",
        place: "San Salvador - defensa",
        title: "Estacionamiento en linea roja - defensa",
        placa: "P 123ABC",
        denuncia: {
            descripcion: "Estacionamiento en linea roja - defensa",
            evidencias: [
                {
                    id: "1",
                    name: "evidencia1.jpg",
                    sourceUrl: "https://picsum.photos/200/300",
                    size: "100",
                },
                {
                    id: "2",
                    name: "evidencia2.jpg",
                    sourceUrl: "https://picsum.photos/200/300",
                    size: "100",
                },
                {
                    id: "3",
                    name: "evidencia3.mp4",
                    sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    size: "100",
                },
            ],
        }
    },
    {
        caseNumber: "D-2026-000124",
        caseDate: "15/09/2026 10:42",
        place: "San Miguel",
        title: "Estacionado en linea roja",
        placa: "P 123DEF",
        denuncia: {
            descripcion: "Estacionamiento en linea roja - defensa",
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
            descripcion: "Estacionado en zona roja - defensa",
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

export default function ViviDefense({ caseId }: { caseId: Case["caseNumber"] }) {
    const [caseData, setCaseData] = useState<Case | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{ message: string } | undefined>();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>();
    const router = useRouter();
    useEffect(() => {
        let cancelled = false;

        async function loadDenuncia() {
            setLoading(true);
            setError(undefined);

            try {
                let data: Case | undefined;

                await new Promise((resolve) => setTimeout(resolve, 5000));
                if (Math.random() > 0.9) {
                    throw new Error();
                }
                data = denuncias.find((item) => item.caseNumber === caseId);

                // data = (await fetchDenunciaByIdClient(caseId)) ?? undefined;

                if (!cancelled) {
                    setCaseData(data);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError({
                        message:
                            loadError instanceof Error && loadError.message
                                ? loadError.message
                                : "Error al cargar la denuncia.",
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
    }, [caseId]);

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
        setDefenseData((current) => ({ ...current, attachments: files }));
    }

    const renderCaseInfo = (key: string, value: string) => {
        return (
        <div className={styles.caseInfoItem}>
            <Text className={styles.caseInfoItemTitle} variant="Medium">{key}</Text>
            <Text className={styles.caseInfoItemValue} variant="Large"><strong>{value}</strong></Text>
        </div>
        )
    }

    const handleSubmit = async () => {
        const parsed = defenseSchema.safeParse(defenseData);
        if (!parsed.success) {
            const message = parsed.error.issues.map((issue) => issue.message).join("\n");
            alert(message || "Revisa los datos de la defensa");
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError(undefined);

            console.log(parsed.data);

            // await submitDefenseClient(caseId, parsed.data);
        } catch (submitErr) {
            setSubmitError(
                submitErr instanceof Error && submitErr.message
                    ? submitErr.message
                    : "No se pudo enviar la defensa."
            );
        } finally {
            setSubmitting(false);
        }
    }

    const handleCancel = () => {
        router.push(`/tramite-reporte/${caseId}`);
    }

    if (loading) {
        return (
            <div className={styles.mainContainer}>
                <SectionTitle>Presentar defensa</SectionTitle>
                <LoadingSpinner variant='page-wide' />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.mainContainer}>
                <SectionTitle>Presentar defensa</SectionTitle>
                <Text>{error.message}</Text>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className={styles.mainContainer}>
                <SectionTitle>Presentar defensa</SectionTitle>
                <Text>No se encontró la denuncia.</Text>
            </div>
        );
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
                        {renderCaseInfo("Hecho denunciado", caseData.denuncia.descripcion)}
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
                        placeholder={defenseData.personalDocumentType === "dpi" ? "Ingresa tu número de DPI" : "Ingresa tu número de pasaporte"}
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
                        accept={[...defenseAttachmentAccept]}
                        maxSizeBytes={defenseAttachmentMaxBytes}
                        maxTotalSizeBytes={defenseAttachmentMaxBytes}
                        maxFiles={defenseAttachmentMaxFiles}
                        onChange={handleFileUpload}
                    />
                </CardGeneral>
                <Checkbox
                    key="declaration"
                    checked={defenseData.declaration}
                    onChange={(event) => setDefenseData({ ...defenseData, declaration: event.target.checked })}
                    label='Declaro que la información y los archivos que presento son verdaderos. Esta información es autodeclarada y EMETRA puede verificarla más adelante.'
                />
                {submitError ? <Text variant='Medium' className={styles.errorText}>{submitError}</Text> : null}
                <div className={styles.actionsContainer}>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Enviando defensa..." : "Enviar defensa"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    )
}
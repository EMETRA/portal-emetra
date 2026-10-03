import z from "zod";

/** Mismos límites de anexos de la defensa. */
export const defenseAttachmentAccept = ["image/jpeg", "image/png", "image/gif", "video/mp4"] as const;
export const defenseAttachmentMaxBytes = 20 * 1024 * 1024;
export const defenseAttachmentMaxFiles = 10;

const defenseAttachment = z
    .file({ error: "Archivo no válido" })
    .mime([...defenseAttachmentAccept], { error: "Formato no permitido. Usa JPG, PNG, GIF o MP4" })
    .max(defenseAttachmentMaxBytes, { error: "El archivo supera el tamaño permitido" });

const defenseCommon = {
    name: z.string().min(1, "El nombre es requerido"),
    email: z.email("El email es inválido"),
    phone: z.string().min(8, "El teléfono es requerido").max(8, "El teléfono es requerido"),
    arguments: z.string().min(1, "El argumento es requerido").max(1000, "El argumento es requerido"),
    attachments: z
        .array(defenseAttachment)
        .max(defenseAttachmentMaxFiles, { error: "Se superó el límite de archivos" })
        .refine(
            (files) => files.reduce((total, file) => total + file.size, 0) <= defenseAttachmentMaxBytes,
            { error: "El total de los archivos supera el tamaño permitido" }
        ),
    declaration: z.literal(true, "Debes aceptar la declaración"),
};

/**
 * Schema para defensa de una denuncia.
 * Solo exige el documento que corresponde a personalDocumentType.
 */
export const defenseSchema = z.discriminatedUnion("personalDocumentType", [
    z.object({
        ...defenseCommon,
        personalDocumentType: z.literal("dpi"),
        dpi: z.string().regex(/^\d{13}$/, "El DPI debe tener exactamente 13 dígitos"),
        passport: z.string().optional(),
    }).strict(),
    z.object({
        ...defenseCommon,
        personalDocumentType: z.literal("passport"),
        dpi: z.string().optional(),
        passport: z.string().min(1, "El pasaporte es requerido"),
    }).strict(),
]);
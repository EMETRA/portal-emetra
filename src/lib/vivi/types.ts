
export type DefenseFile = {
    id: string,
    name: string,
    sourceUrl: string,
    size: string
}

export type EstadoCaso =
    | "NOTIFICADA"

export type AccionCaso =
    | "REFUTAR"

export type EstadoDefensa =
    | "DEFENSA_WEB"

export type IdentidadDefensa =
    | "DECLARADA_NO_ACREDITADA"

export type EstadoDocumentoDefensa =
    | "DISPONIBLE"
    | "ERROR_RECUPERABLE"

export type Case = {
    id: string,
    codigo: string,
    usoPlaca: string,
    placa: string,
    regla: string,
    descripcionHecho: string,
    observaciones: string,
    estado: EstadoCaso,
    denuncia: {
        evidencias: DefenseFile[]
    }
}

export type ConsultaCasoResponse = {
    caso: Case,
    accion: AccionCaso,
    puedePresentarDefensa: boolean,
}

export type defenseData = {
    name: string,
    personalDocumentType: "dpi" | "passport",
    dpi?: string,
    passport?: string,
    email: string,
    phone: string,
    arguments: string,
    attachments: File[],
    declaration: boolean,
}

export type DefenseResponse = {
    idDefensa: string,
    idCaso: Case["id"],
    codigoCaso: Case["codigo"],
    numeroVersion: number,
    estado: EstadoDefensa,
    presentadaWebEn: string,
    identidad: IdentidadDefensa,
    idempotente: boolean,
    documento: DocumentoDefensa,
}

export type DocumentoDefensa = {
    estado: EstadoDocumentoDefensa,
    idDefensa: DefenseResponse["idDefensa"],
    numeroVersion: DefenseResponse["numeroVersion"],
    versionPlantilla: string,
    mime: string,
    tamanoBytes: number,
    sha256: string,
    descargar: string,
}

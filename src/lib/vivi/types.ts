
export type DefenseFile = {
    id: string,
    name: string,
    sourceUrl: string,
    size: string
    mime?: string,
}

export type Case = {
    caseNumber: string,
    caseDate: string,
    place: string,
    latitud?: number | null,
    longitud?: number | null,
    montoBase?: number | null,
    title: string,
    placa: string,
    evidenceError?: boolean,
    denuncia: {
        descripcion: string,
        evidencias: DefenseFile[]
    }
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
    caseNumber: Case["caseNumber"],
    pdfUrl: string,
    idDefensa: string,
}

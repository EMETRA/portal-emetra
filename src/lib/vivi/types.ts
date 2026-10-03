
export type DefenseFile = {
    id: string,
    name: string,
    sourceUrl: string,
    size: string
}

export type Case = {
    caseNumber: string,
    caseDate: string,
    place: string,
    title: string,
    placa: string,
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
}

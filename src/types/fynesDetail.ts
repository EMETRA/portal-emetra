import { FineCategory } from "./fines";

export interface FineDetail {
    series: string;
    number: string;
    category: FineCategory;
    totalAmount: number;
    description: string;
    date: string;
    location: string;
    article: string;
    numeral: string;
    evidenceImageUrl: string;
    additionalInfo: {
        conductor: string;
        licencia: string;
        tipoLicencia: string;
    };
    legalInfo: {
        personaNotificada: string;
        fechaImpugnacion: string;
        ultimaFechaPago: string;
    };
    longDescription: string;
}
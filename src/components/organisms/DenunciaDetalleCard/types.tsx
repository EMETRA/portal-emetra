export interface Evidencia {
    id: string | number;
    url: string;
    alt?: string;
};

export interface DenunciaDetalle {
    numero: string;
    placa: string;
    hecho: string;
    fechaHora: string;
    montoBase: number;
    evidencias: Evidencia[];
};

export interface DenunciaDetalleCardProps {
    denuncia: DenunciaDetalle;
    loading?: boolean;
};
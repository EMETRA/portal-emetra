import { DenunciaDetalle } from "../DenunciaDetalleCard/types";

type ResultadoStatus = "success" | "error";

export interface DenunciaConfirmacionResultadoProps {
    status: ResultadoStatus;
    numeroRemision?: string;
    denuncia: DenunciaDetalle;
    onContinuar: () => void;
    onReintentar: () => void;
    onVolver: () => void;
    loading?: boolean;
}
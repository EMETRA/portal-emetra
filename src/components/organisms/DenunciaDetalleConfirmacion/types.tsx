import { DenunciaDetalle } from "../DenunciaDetalleCard/types";

export interface DenunciaDetalleConfirmacionProps {
    denuncia: DenunciaDetalle;
    onConfirmar: () => void;
    onVolver: () => void;
    loading?: boolean;
}
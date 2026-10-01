import type { Case } from "@/lib/vivi/types";

export interface DenunciaDetalleConfirmacionProps {
    denuncia: Case;
    onConfirmar: () => void;
    onVolver: () => void;
    loading?: boolean;
}
import type { Case } from "@/lib/vivi/vivi";

export interface DenunciaDetalleConfirmacionProps {
    denuncia: Case;
    onConfirmar: () => void;
    onVolver: () => void;
    loading?: boolean;
}
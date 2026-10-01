import type { Case } from "@/lib/vivi/vivi";

type ResultadoStatus = "success" | "error";

export interface DenunciaConfirmacionResultadoProps {
    status: ResultadoStatus;
    numeroRemision?: string;
    denuncia: Case;
    onContinuar: () => void;
    onReintentar: () => void;
    onVolver: () => void;
    loading?: boolean;
}
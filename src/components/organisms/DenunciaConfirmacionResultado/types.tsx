import type { Case } from "@/lib/vivi/types";

type ResultadoStatus = "success" | "error";

export interface DenunciaConfirmacionResultadoProps {
    status: ResultadoStatus;
    numeroRemision?: string;
    denuncia: Case;
    onContinuar: () => void;
    onReintentar: () => void;
    onVolver: () => void;
    loading?: boolean;
    pagoDisponible?: boolean;
    yaAceptada?: boolean;
    errorMessage?: string;
}


export interface CasilleroCambioTelefonoProps {
    isOpen: boolean;
    onClose: () => void;
    onCompleted?: () => void;
    oldPhone?: string;
}


export interface CasilleroNotificationModalProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    /** Se llama si el backend responde 401 al pedir el detalle o el documento (sesión vencida). */
    onSesionVencida?: () => void;
}

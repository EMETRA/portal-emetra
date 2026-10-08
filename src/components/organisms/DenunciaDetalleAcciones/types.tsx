export interface DenunciaDetalleAccionesProps {
    onAceptarPago: () => void;
    onPresentarDefensa: () => void;
    loading?: boolean;
    puedeAceptar?: boolean;
    puedeDefender?: boolean;
}

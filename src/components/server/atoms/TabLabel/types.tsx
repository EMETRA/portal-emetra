export interface TabLabelProps {
  /** Identificador único de la pestaña */
  id: string;
  /** Texto que se muestra en la pestaña */
  label: string;
  /** Si es la pestaña activa */
  isActive: boolean;
  /** Handler cuando se clickea */
  onClick: (id: string) => void;
  /** Clases extra opcionales */
  className?: string;
}

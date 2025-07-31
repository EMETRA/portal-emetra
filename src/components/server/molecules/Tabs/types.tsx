export interface TabItem {
  id:    string;
  label: string;
}

export interface TabsProps {
  /** Lista de pestañas a renderizar */
  items:    TabItem[];
  /** id de la pestaña actualmente activa */
  activeId: string;
  /** callback cuando el usuario selecciona otra pestaña */
  onChange: (newId: string) => void;
  /** clases extra opcionales */
  className?: string;
}

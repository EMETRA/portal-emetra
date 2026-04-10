export interface Column<T> {
    /** clave única para la columna */
    key: string;
    /** etiqueta que se muestra en el header */
    label: string;
    /**
     * renderiza contenido customizado de la celda.
     * Si no se provee, se mostrará row[key].
     */
    render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
    /** definición de las columnas */
    columns: Column<T>[];
    /** filas a mostrar */
    data: T[];
    /** si se muestran checkboxes para selección */
    selectable?: boolean;
    /** lista de ids seleccionados */
    selectedKeys?: string[];
    /** callback cuando se marca/desmarca una fila */
    onToggleSelect?: (row: T) => void;
}

/**
 * TODO [CASILLERO-BACKEND]: dato del diseño que la API todavía no manda. Muestra el valor
 * de ejemplo (si se pasa) y deja una marca que no ocupa espacio ni se ve; sirve para
 * encontrar los pendientes buscando `PendienteApi` o `data-pendiente-api`. Cuando la API
 * mande el dato, se reemplaza por el valor real.
 */
export default function PendienteApi({
    campo,
    ejemplo,
}: {
    campo: string;
    /** Valor de muestra del diseño (DATOS_DE_EJEMPLO). */
    ejemplo?: React.ReactNode;
}) {
    return (
        <>
            {ejemplo}
            <span data-pendiente-api={campo} style={{ display: "contents" }} />
        </>
    );
}

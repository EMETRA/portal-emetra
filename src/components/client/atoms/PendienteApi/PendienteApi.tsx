/**
 * TODO [CASILLERO-BACKEND]: marca de un dato del diseño que la API todavía no manda.
 * No ocupa espacio ni se ve; sirve para encontrar los pendientes buscando
 * `PendienteApi` o `data-pendiente-api`. Cuando la API mande el dato, se reemplaza por
 * el valor real.
 */
export default function PendienteApi({ campo }: { campo: string }) {
    return <span data-pendiente-api={campo} style={{ display: "contents" }} />;
}

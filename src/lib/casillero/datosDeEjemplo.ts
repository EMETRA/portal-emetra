/**
 * TODO [CASILLERO-BACKEND]: valores de muestra del diseño para los datos que la API de
 * Cobros todavía no manda. Se muestran en su lugar (con la marca PendienteApi al lado) para
 * que las pantallas se vean como en Figma. No son datos del usuario: cuando la API mande
 * cada dato, se quita de aquí y se usa el valor real.
 */
export const DATOS_DE_EJEMPLO = {
    vehiculo: {
        modelo: "Toyota corolla",
        color: "Gris",
        anio: 2020,
    },
    multa: {
        codigo: "N456123",
        serie: "N",
        numero: "456123",
        lugar: "Calzada Roosevelt",
        fecha: "21/05/2026",
        fechaLarga: "21 mayo 2026",
        articulo: "45",
        numeral: "12",
        evidenciaUrl: "/images/banner.jpg",
        conductor: "Daniel Esteban Morales Urizar",
        licencia: "1234567891234",
        tipoLicencia: "C",
        personaNotificada: "Daniel Esteban Morales Urizar",
        fechaImpugnacion: "No registrada",
        descripcion:
            "El vehículo fue detectado excediendo el límite permitido de velocidad sobre la Calzada Roosevelt en dirección norte, a la altura de la 14 avenida, según registro realizado por agente municipal de tránsito.",
    },
} as const;

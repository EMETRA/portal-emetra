"use client";

import { addMonths, isAfter, isBefore, parse, startOfDay } from "date-fns";
import { useEffect, useState, useCallback } from "react";
import Map from "@/components/client/atoms/Map";
import Calendar from "@/components/server/molecules/Calendar/Calendar";
import {
  fetchPrediceEventsClient,
  PrediceEventDto,
} from "@/lib/predice/api";
import classNames from "classnames";
import styles from "@/app/predice/Page.module.scss";

const REVALIDATION_INTERVAL_MS = 180000;

const today = startOfDay(new Date());
const twoMonthsLater = addMonths(today, 2);

function isValidCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isActiveEvent(event: PrediceEventDto) {
  return event.extendedProps?.status === "ACTIVO";
}

function parseEventDate(date?: string | null) {
  if (!date) return null;
  const parsed = parse(date, "dd/MM/yyyy", new Date());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function PrediceContent() {
  const [events, setEvents] = useState<PrediceEventDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const fetchedEvents = await fetchPrediceEventsClient();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error al cargar eventos de Predice:", error);
    } finally {
      setLoading(false);
      setEvents(eventos);
    }
  }, []);

  useEffect(() => {
    loadEvents();

    const intervalId = setInterval(() => {
      loadEvents();
    }, REVALIDATION_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadEvents]);

  const activeEvents = events.filter(isActiveEvent);
  const eventsWithinTwoMonths = activeEvents.filter((event) => {
    const parsedDate = parseEventDate(event.start ?? event.fechai ?? undefined);
    if (!parsedDate) return false;
    return (
      (isAfter(parsedDate, today) ||
        parsedDate.getTime() === today.getTime()) &&
      isBefore(parsedDate, twoMonthsLater)
    );
  });

  const mapEvents = eventsWithinTwoMonths
    .filter((event) =>
      isValidCoordinate(event.extendedProps?.latitud) &&
      isValidCoordinate(event.extendedProps?.longitud),
    )
    .map((event) => ({
      id: String(event.id),
      name: event.title,
      lat: event.extendedProps!.latitud as number,
      lng: event.extendedProps!.longitud as number,
      start: event.start ?? event.fechai ?? undefined,
      end: event.end ?? event.fechaf ?? undefined,
      horai: event.horai ?? undefined,
      horaf: event.horaf ?? undefined,
      aforo: event.estimado ?? undefined,
      parqueosDisponibles: event.parqueosDisponibles ?? undefined,
    }));

    const eventos = [{
        "id": 2335,
        "title": "CAMINATA - ESCUELA SAN JOSE LOS PINOS NO.1495",
        "start": "11/09/2025",
        "end": "11/09/2025",
        "fechai": "11/09/2025",
        "fechaf": "11/09/2025",
        "horai": "09:00:00",
        "horaf": "12:00:00",
        "estimado": 100,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "CAMINATA - ESCUELA SAN JOSE LOS PINOS NO.1495",
            "propietario": "MUNICIPALIDAD DE MIXCO",
            "lugar": "GASOLINERA SHELL MIXCO NORTE",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Culturales",
            "categoria": "Eventos que celebran o promueven la cultura local e internacional, incluyendo festivales de música, danza, arte, y exposiciones culturales.",
            "foto": null,
            "longitud": -90.57479739189148,
            "latitud": 14.643897233094895
        },
        "parqueos": [],
        "muni": 7
    },
    {
        "id": 2338,
        "title": "ANTORCHA - LIGA INDEPENDENCIA LA ISLA",
        "start": "14/09/2025",
        "end": "14/09/2025",
        "fechai": "14/09/2025",
        "fechaf": "14/09/2025",
        "horai": "17:00:00",
        "horaf": "22:00:00",
        "estimado": 100,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "ANTORCHA - LIGA INDEPENDENCIA LA ISLA",
            "propietario": "MUNICIPALIDAD DE GUATEMALA",
            "lugar": "7 AVENIDA Y 10 CALLE PRIMERO DE JULIO ZONA 5 (GASOLINERA PUMA)",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Culturales",
            "categoria": "Eventos que celebran o promueven la cultura local e internacional, incluyendo festivales de música, danza, arte, y exposiciones culturales.",
            "foto": null,
            "longitud": -90.56948661804199,
            "latitud": 14.670074831490137
        },
        "parqueos": [],
        "muni": 7
    },
    {
        "id": 2841,
        "title": "CONCIERTO KUDAI",
        "start": "20/11/2025",
        "end": "20/11/2025",
        "fechai": "20/11/2025",
        "fechaf": "20/11/2025",
        "horai": "20:00:00",
        "horaf": "23:30:00",
        "estimado": 702,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Concierto de la banda chilena KUDAI",
            "propietario": "NiuMark, S.A.",
            "lugar": "Parque de la Industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Culturales",
            "categoria": "Eventos que celebran o promueven la cultura local e internacional, incluyendo festivales de música, danza, arte, y exposiciones culturales.",
            "foto": null,
            "longitud": -90.523738861084,
            "latitud": 14.608617924888874
        },
        "parqueos": [
            {
                "id": 921,
                "descripcion": "Parqueo parque de la Industria",
                "direccion": "Parque de la industria ",
                "capacidad": 539,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5231595256812,
                "latitud": 14.607952378624196
            }
        ],
        "muni": 1
    },
    {
        "id": 3321,
        "title": "ELECCIÓN DE REPRESENTANTE DEL COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA,",
        "start": "13/01/2026",
        "end": "13/01/2026",
        "fechai": "13/01/2026",
        "fechaf": "13/01/2026",
        "horai": "06:00:00",
        "horaf": "18:00:00",
        "estimado": 4000,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Elección de agremiados",
            "propietario": "Eddy Amilcar Morales Mazariegos",
            "lugar": "parque de la industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.52330891318795,
            "latitud": 14.60853486961763
        },
        "parqueos": [],
        "muni": 1
    },
    {
        "id": 3441,
        "title": "INNOVATION &AMP; TECHNOLOGY EXPOCONGRESO 2026",
        "start": "19/02/2026",
        "end": "19/02/2026",
        "fechai": "19/02/2026",
        "fechaf": "19/02/2026",
        "horai": "08:48:00",
        "horaf": "18:00:00",
        "estimado": 2000,
        "parqueosDisponibles": 343,
        "extendedProps": {
            "descripcion": "Innovación tecnológica",
            "propietario": "Alejandra De León",
            "lugar": "Avenida la Reforma y 14 Calle, Ciudad de Guatemala",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.51637756865489,
            "latitud": 14.597925224795635
        },
        "parqueos": [
            {
                "id": 1342,
                "descripcion": "PARQUEO THE WESTIN CAMINO REAL, GUATEMALA",
                "direccion": "Avenida Reforma y 14 Calle, Ciudad de Guatemala",
                "capacidad": 275,
                "reservados": 100,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.51637887954713,
                "latitud": 14.597912490021198
            },
            {
                "id": 2101,
                "descripcion": "SHUTTLE A PARQUEOS DE C.C. LOS PROCERES",
                "direccion": "18 Avenida, 17-42, Zona 10, Ciudad de Guatemala",
                "capacidad": 500,
                "reservados": 150,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.516378879547,
                "latitud": 14.597912490021
            },
            {
                "id": 2102,
                "descripcion": "HOTEL A C.C. LOS PROCERES: EN HOTEL BILTMORE",
                "direccion": "15 Calle 0-31, Cdad. de Guatemala 01010",
                "capacidad": 200,
                "reservados": 93,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.516378879547,
                "latitud": 14.597912490021
            }
        ],
        "muni": 1
    },
    {
        "id": 3322,
        "title": "ELECCIÓN DE REPRESENTANTE DEL COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA,",
        "start": "13/01/2026",
        "end": "13/01/2026",
        "fechai": "13/01/2026",
        "fechaf": "13/01/2026",
        "horai": "06:00:00",
        "horaf": "18:00:00",
        "estimado": 4000,
        "parqueosDisponibles": 150,
        "extendedProps": {
            "descripcion": "Elección de agremiados",
            "propietario": "Eddy Amilcar Morales Mazariegos",
            "lugar": "parque de la industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.52330891318795,
            "latitud": 14.60853486961763
        },
        "parqueos": [
            {
                "id": 1961,
                "descripcion": "PARQUEO PARQUE DE LA INDUSTRIA",
                "direccion": "Parque de la industria ",
                "capacidad": 591,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52398967679,
                "latitud": 14.60627781266
            },
            {
                "id": 1962,
                "descripcion": "PARQUEO 6 CALLE Y 5 AVENIDA",
                "direccion": "parqueo 6 calle y 5 avenida",
                "capacidad": 300,
                "reservados": 150,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52398967679,
                "latitud": 14.60627781266
            },
            {
                "id": 442,
                "descripcion": "Parqueo Turitran",
                "direccion": "2 avenida 8 calle",
                "capacidad": 400,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52398967678951,
                "latitud": 14.606277812660238
            }
        ],
        "muni": 1
    },
    {
        "id": 3584,
        "title": "SEGUNDA VUELTA ELECCIONES DE REPRESENTANTES DEL CANG ANTE LA UNIVERSIDAD DE SAN CARLOS DE GUATEMALA",
        "start": "13/02/2026",
        "end": "13/02/2026",
        "fechai": "13/02/2026",
        "fechaf": "13/02/2026",
        "horai": "08:00:00",
        "horaf": "18:00:00",
        "estimado": 3000,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Elecciones CANG",
            "propietario": "Eddy Morales Mazariegos",
            "lugar": "parque Erick Barrondo",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 1761,
                "descripcion": "PARQUEO ERICK BARRONDO",
                "direccion": "Parqueos internos del parque",
                "capacidad": 750,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.54563105106354,
                "latitud": 14.637114012011626
            }
        ],
        "muni": 1
    },
    {
        "id": 3721,
        "title": "TROPHY TOUR",
        "start": "13/02/2026",
        "end": "13/02/2026",
        "fechai": "13/02/2026",
        "fechaf": "13/02/2026",
        "horai": "09:00:00",
        "horaf": "22:00:00",
        "estimado": 3000,
        "parqueosDisponibles": 1040,
        "extendedProps": {
            "descripcion": "Exhibicion de la copa mundial de futbol, con balones camisolas y historia de cada mundial de futbol pasado",
            "propietario": "Manuel Enrique Guevara de Leon",
            "lugar": "parque de la industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.52358865737916,
            "latitud": 14.609240713274238
        },
        "parqueos": [
            {
                "id": 1021,
                "descripcion": "Parqueo del parque de la industria, Parqueo 3, Parqueo 2 y Parqueo 1",
                "direccion": "8a. Calle 2-33, zona 9, Guatemala, Guatemala ",
                "capacidad": 1040,
                "reservados": 1040,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52484861766153,
                "latitud": 14.60965034703659
            }
        ],
        "muni": 1
    },
    {
        "id": 3561,
        "title": "EXPO MEDIA MARATON MAX TOTT",
        "start": "23/01/2026",
        "end": "24/01/2026",
        "fechai": "23/01/2026",
        "fechaf": "24/01/2026",
        "horai": "09:00:00",
        "horaf": "18:00:00",
        "estimado": 7972,
        "parqueosDisponibles": 300,
        "extendedProps": {
            "descripcion": "Expo de la media maratón MAX TOTT",
            "propietario": "CARLOS ROBERTO TOTT ROMAN",
            "lugar": "Parque de la Industria Salón 9",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Deportivos",
            "categoria": "Competencias y actividades físicas que promueven el deporte y la salud, tales como maratones, torneos deportivos y clases de fitness al aire libre.",
            "foto": null,
            "longitud": -90.52129268646242,
            "latitud": 14.608750814144724
        },
        "parqueos": [
            {
                "id": 2049,
                "descripcion": "PARQUE DE LA INDUSTRIA",
                "direccion": "8a calle 2-33, zona 9 ciudad de Guatemala",
                "capacidad": 474,
                "reservados": 300,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52500866868867,
                "latitud": 14.610169572003665
            }
        ],
        "muni": 1
    },
    {
        "id": 3761,
        "title": "SEMINARIO DE PELUQUERIA CANINA",
        "start": "29/03/2026",
        "end": "29/03/2026",
        "fechai": "29/03/2026",
        "fechaf": "29/03/2026",
        "horai": "08:00:00",
        "horaf": "16:00:00",
        "estimado": 75,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "seminario de peluqueria canina",
            "propietario": "CLARA  PEDROZA",
            "lugar": "8a Calle Pista Izquierda, Zona 9, Ciudad de Guatemala, entre la Avenida La Castellana y la 6a Avenida",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Educativos",
            "categoria": "Actividades diseñadas para educar e informar al público sobre diversos temas, como conferencias, talleres, seminarios y ferias educativas.",
            "foto": null,
            "longitud": -90.586464,
            "latitud": 14.543276
        },
        "parqueos": [],
        "muni": 1
    },
    {
        "id": 3582,
        "title": "SEGUNDA VUELTA ELECCION DE TITULAR Y SUPLENTE DE LA CORTE DE CONSTITUCIONALIDAD Y TRIBUNAL ELECTORAL DEL COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA",
        "start": "12/01/2026",
        "end": "12/01/2026",
        "fechai": "12/01/2026",
        "fechaf": "12/01/2026",
        "horai": "08:00:00",
        "horaf": "18:00:00",
        "estimado": 3000,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Elecciones CANG",
            "propietario": "Eddy Morales Mazariegos",
            "lugar": "club de oficiales la aurora",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 2161,
                "descripcion": "CLUB DE OFICIALES LA AURORA",
                "direccion": "club de oficiales la aurora",
                "capacidad": 450,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.531697945397,
                "latitud": 14.59432561824
            }
        ],
        "muni": 1
    },
    {
        "id": 3587,
        "title": "ELECCIÓN DE MAGISTRADO TITULAR Y SUPLENTE CORTE DE CONSTITUCIONAL Y TRIBUNAL ELECTORAL",
        "start": "12/02/2026",
        "end": "12/02/2026",
        "fechai": "12/02/2026",
        "fechaf": "12/02/2026",
        "horai": "08:00:00",
        "horaf": "18:00:00",
        "estimado": 2999,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "eleccion cang",
            "propietario": "Eddy Morales Mazariegos",
            "lugar": "parque erick barrondo",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 1761,
                "descripcion": "PARQUEO ERICK BARRONDO",
                "direccion": "Parqueos internos del parque",
                "capacidad": 750,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.54563105106354,
                "latitud": 14.637114012011626
            }
        ],
        "muni": 1
    },
    {
        "id": 3681,
        "title": "EXPOAQUA INTERNACIONAL",
        "start": "18/02/2026",
        "end": "21/02/2026",
        "fechai": "18/02/2026",
        "fechaf": "21/02/2026",
        "horai": "09:00:00",
        "horaf": "22:00:00",
        "estimado": 4500,
        "parqueosDisponibles": 300,
        "extendedProps": {
            "descripcion": "Es una EXPO de Agua.  Productos, capacitaciones, presentación de expositores.",
            "propietario": "Aquasistemas",
            "lugar": "nillo Periférico 27 avenida 6-40, zona 11. Ciudad de Guatemala, 01011.",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Educativos",
            "categoria": "Actividades diseñadas para educar e informar al público sobre diversos temas, como conferencias, talleres, seminarios y ferias educativas.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 2221,
                "descripcion": "PARQUEO FORUM MAJADAS",
                "direccion": "Anillo Periférico. 27 avenida 6-40, zona 11",
                "capacidad": 500,
                "reservados": 300,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52128,
                "latitud": 14.584895
            }
        ],
        "muni": 1
    },
    {
        "id": 3701,
        "title": "EXPOAQUA INTERNACIONAL",
        "start": "18/02/2026",
        "end": "21/02/2026",
        "fechai": "18/02/2026",
        "fechaf": "21/02/2026",
        "horai": "10:00:00",
        "horaf": "22:00:00",
        "estimado": 5000,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Exposición y Capacitación en productos del agua.",
            "propietario": "Aquasistemas",
            "lugar": "Anillo Periférico 27 avenida 6-40, zona 11. Ciudad de Guatemala, 01011.",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Educativos",
            "categoria": "Actividades diseñadas para educar e informar al público sobre diversos temas, como conferencias, talleres, seminarios y ferias educativas.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [],
        "muni": 1
    },
    {
        "id": 3842,
        "title": "CARRRERA MCDONALD´S",
        "start": "21/02/2026",
        "end": "21/02/2026",
        "fechai": "21/02/2026",
        "fechaf": "21/02/2026",
        "horai": "13:29:00",
        "horaf": "20:29:00",
        "estimado": 7000,
        "parqueosDisponibles": 500,
        "extendedProps": {
            "descripcion": "Expo McDonald´s",
            "propietario": "McDonald´s",
            "lugar": "6 calla y 6 avenida zona 9",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Deportivos",
            "categoria": "Competencias y actividades físicas que promueven el deporte y la salud, tales como maratones, torneos deportivos y clases de fitness al aire libre.",
            "foto": null,
            "longitud": -90.52459642423386,
            "latitud": 14.609829233457972
        },
        "parqueos": [
            {
                "id": 921,
                "descripcion": "Parqueo parque de la Industria",
                "direccion": "Parque de la industria ",
                "capacidad": 539,
                "reservados": 500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5231595256812,
                "latitud": 14.607952378624196
            }
        ],
        "muni": 1
    },
    {
        "id": 3364,
        "title": "VIVO ARJONA (TRIBUTO A RICARDO ARJONA)",
        "start": "20/02/2026",
        "end": "20/02/2026",
        "fechai": "20/02/2026",
        "fechaf": "20/02/2026",
        "horai": "20:00:00",
        "horaf": "23:59:00",
        "estimado": 664,
        "parqueosDisponibles": 600,
        "extendedProps": {
            "descripcion": "Concierto de música popular",
            "propietario": "Edgar Haroldo González Oriano",
            "lugar": "8a. Calle 2-33 zona 9. Guatemala, Guatemala.",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.52438259124757,
            "latitud": 14.608513975101214
        },
        "parqueos": [
            {
                "id": 1982,
                "descripcion": "PARQUEO DEL PARQUE DE LA INDUSTRIA",
                "direccion": "8a. Calle 2-33 zona 9.",
                "capacidad": 600,
                "reservados": 600,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52356719970705,
                "latitud": 14.609254988464281
            }
        ],
        "muni": 1
    },
    {
        "id": 3482,
        "title": "ELECCIONES COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA",
        "start": "13/01/2026",
        "end": "13/01/2023",
        "fechai": "13/01/2026",
        "fechaf": "13/01/2023",
        "horai": "08:00:00",
        "horaf": "18:00:00",
        "estimado": 3000,
        "parqueosDisponibles": 2000,
        "extendedProps": {
            "descripcion": "CANG",
            "propietario": "Colegio de Abogados y Notarios de Guatemala",
            "lugar": "Vía Majadas",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.56004398306084,
            "latitud": 14.621410928366721
        },
        "parqueos": [
            {
                "id": 2121,
                "descripcion": "VIA MAJADAS",
                "direccion": "27 av 6-40 zona 11",
                "capacidad": 300,
                "reservados": 300,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52128,
                "latitud": 14.584895
            },
            {
                "id": 1404,
                "descripcion": "PLAZA MAJADAS",
                "direccion": "Parque Comercial Majadas 8a calle 28-00 Guatemala",
                "capacidad": 1500,
                "reservados": 1500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52128,
                "latitud": 14.584895
            },
            {
                "id": 1542,
                "descripcion": "MAJADAS ONCE",
                "direccion": "ANILLO PERIFÉRICO 27 AVENIDA 6-40, ZONA 11.",
                "capacidad": 400,
                "reservados": 200,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5604319853108,
                "latitud": 14.621114106654517
            }
        ],
        "muni": 1
    },
    {
        "id": 3621,
        "title": "FESTIVAL METAL MASTERS",
        "start": "31/01/2026",
        "end": "31/01/2026",
        "fechai": "31/01/2026",
        "fechaf": "31/01/2026",
        "horai": "00:00:00",
        "horaf": "23:00:00",
        "estimado": 1000,
        "parqueosDisponibles": 300,
        "extendedProps": {
            "descripcion": "Festival de música contemporánea a realizarse en la concha acústica del parque de la industria",
            "propietario": "Fernando Diaz",
            "lugar": "Parque de La Industria, Concha Acústica",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Culturales",
            "categoria": "Eventos que celebran o promueven la cultura local e internacional, incluyendo festivales de música, danza, arte, y exposiciones culturales.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 2201,
                "descripcion": "300",
                "direccion": "8a Calle 2-33, Zona 9",
                "capacidad": 300,
                "reservados": 300,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5152577161789,
                "latitud": 14.626897765589398
            }
        ],
        "muni": 1
    },
    {
        "id": 3841,
        "title": "CARRERA MCDONAD´S",
        "start": "22/02/2026",
        "end": "22/02/2026",
        "fechai": "22/02/2026",
        "fechaf": "22/02/2026",
        "horai": "13:33:00",
        "horaf": "13:33:00",
        "estimado": 700,
        "parqueosDisponibles": 1475,
        "extendedProps": {
            "descripcion": "Carrera McDonad´s",
            "propietario": "McDonald´s",
            "lugar": "12 calle avenida Reforma zona 9",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.52333390710261,
            "latitud": 14.62340935460807
        },
        "parqueos": [
            {
                "id": 1342,
                "descripcion": "PARQUEO THE WESTIN CAMINO REAL, GUATEMALA",
                "direccion": "Avenida Reforma y 14 Calle, Ciudad de Guatemala",
                "capacidad": 275,
                "reservados": 275,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.51637887954713,
                "latitud": 14.597912490021198
            },
            {
                "id": 1005,
                "descripcion": "EDIFICIO AVIA",
                "direccion": "14 calle y 3era Avenida 14-27 zona 10 ",
                "capacidad": 500,
                "reservados": 500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.515383516551,
                "latitud": 14.595273699074
            },
            {
                "id": 331,
                "descripcion": "CENTRO COMERCIAL LOS PROCERES",
                "direccion": "16 CALLE 2 AVENIDA DE LA ZONA 10",
                "capacidad": 500,
                "reservados": 200,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.51538351655144,
                "latitud": 14.595273699073571
            },
            {
                "id": 332,
                "descripcion": "GEMINIS 10",
                "direccion": "12 CALLE 1 AVENIDA DE LA ZONA 10",
                "capacidad": 500,
                "reservados": 500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.51485096344135,
                "latitud": 14.601237944489402
            }
        ],
        "muni": 1
    },
    {
        "id": 3241,
        "title": "THE RITUAL",
        "start": "27/12/2025",
        "end": "27/12/2025",
        "fechai": "27/12/2025",
        "fechaf": "27/12/2025",
        "horai": "14:00:00",
        "horaf": "23:59:00",
        "estimado": 585,
        "parqueosDisponibles": 500,
        "extendedProps": {
            "descripcion": "Concierto de música Popular Electrónica.",
            "propietario": "Grupo Radial Saturno, S.A.",
            "lugar": "Salón de Exposiciones del Zoológico La Aurora",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.52597582340242,
            "latitud": 14.59815883071838
        },
        "parqueos": [
            {
                "id": 1901,
                "descripcion": "PARQUEO ZOOLOGICO LA AURORA",
                "direccion": "5a. Calle final, interior Finca La Aurora Zona 13.",
                "capacidad": 500,
                "reservados": 500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.531764030457,
                "latitud": 14.594280778055
            }
        ],
        "muni": 1
    },
    {
        "id": 3462,
        "title": "EXPO CARRERA MCDONALD’S",
        "start": "20/02/2026",
        "end": "21/02/2026",
        "fechai": "20/02/2026",
        "fechaf": "21/02/2026",
        "horai": "09:00:00",
        "horaf": "20:00:00",
        "estimado": 7000,
        "parqueosDisponibles": 150,
        "extendedProps": {
            "descripcion": "Entrega de Kit de la carrera",
            "propietario": "McDonald’s",
            "lugar": "Parque de la industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.5594792,
            "latitud": 14.5073264
        },
        "parqueos": [
            {
                "id": 921,
                "descripcion": "Parqueo parque de la Industria",
                "direccion": "Parque de la industria ",
                "capacidad": 539,
                "reservados": 150,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5231595256812,
                "latitud": 14.607952378624196
            }
        ],
        "muni": 1
    },
    {
        "id": 3661,
        "title": "ASIATICOGT",
        "start": "15/02/2026",
        "end": "15/02/2026",
        "fechai": "15/02/2026",
        "fechaf": "15/02/2026",
        "horai": "10:19:00",
        "horaf": "18:19:00",
        "estimado": 500,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Evento con ventas y concursos",
            "propietario": "Raúl Quinteros",
            "lugar": "Parque de la Industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Sociales",
            "categoria": "Reuniones que promueven la interacción social y el entretenimiento, como ferias, banquetes y reuniones comunitarias.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [],
        "muni": 1
    },
    {
        "id": 3401,
        "title": "ALMUERZO DEL INGENIERO 2026",
        "start": "16/01/2026",
        "end": "05/01/2026",
        "fechai": "16/01/2026",
        "fechaf": "05/01/2026",
        "horai": "12:00:00",
        "horaf": "23:30:00",
        "estimado": 4500,
        "parqueosDisponibles": 2000,
        "extendedProps": {
            "descripcion": "Actividad para conmemorar el día del Ingeniero",
            "propietario": "Colegio de Ingenieros de Guatemala",
            "lugar": "8a calle 2-33 zona 9 (Parque de la Industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 2061,
                "descripcion": "PARQUEO DEL PARQUE DE LA INDUSTRIA",
                "direccion": "8a. Calle 2-33 zona 9.",
                "capacidad": 2000,
                "reservados": 2000,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.523567199707,
                "latitud": 14.609254988464
            }
        ],
        "muni": 1
    },
    {
        "id": 3501,
        "title": "ALMUERZO DEL INGENIEROS DE GUATEMALA",
        "start": "16/01/2026",
        "end": "16/01/2026",
        "fechai": "16/01/2026",
        "fechaf": "16/01/2026",
        "horai": "12:00:00",
        "horaf": "23:30:00",
        "estimado": 4499,
        "parqueosDisponibles": 1750,
        "extendedProps": {
            "descripcion": "Evento Social",
            "propietario": "Colegio de Ingenieros de Guatemala",
            "lugar": "8a calle 2-33 zona 9",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.5152577161789,
            "latitud": 14.626897765589398
        },
        "parqueos": [
            {
                "id": 2141,
                "descripcion": "PARQUEO 1 COPEREX - PARQUE DE LA INDUSTRIA",
                "direccion": "Puerta 8, parqueo 1 de la 6ta calle 2-33 zona 9, Guatemala, Guatemala",
                "capacidad": 2000,
                "reservados": 1500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5152577161789,
                "latitud": 14.626897765589398
            },
            {
                "id": 2142,
                "descripcion": "UNIVERSIDAD MESOAMERICANA",
                "direccion": "0 Calle 10-02 zona 8 Guatemala",
                "capacidad": 400,
                "reservados": 250,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.522408485413,
                "latitud": 14.609642364859
            }
        ],
        "muni": 1
    },
    {
        "id": 3301,
        "title": "SEGUNDA VUELTA ELECCIÓN DE REPRESENTANTES DEL COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA",
        "start": "13/01/2026",
        "end": "13/01/2026",
        "fechai": "13/01/2026",
        "fechaf": "13/01/2026",
        "horai": "06:00:00",
        "horaf": "18:00:00",
        "estimado": 3000,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "Segunda Vuelta Elección de representantes del Colegio de Abogados y Notarios de Guatemala",
            "propietario": "Eddy Morales Mazariegos",
            "lugar": "parque de la industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.52361331717363,
            "latitud": 14.608734203229762
        },
        "parqueos": [
            {
                "id": 1941,
                "descripcion": "PARQUEO 6 CALLE 5 AVENIDA",
                "direccion": " 6 CALLE 5 AVENIDA ZONA 9",
                "capacidad": 121,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.520200096572,
                "latitud": 14.609105877696
            }
        ],
        "muni": 1
    },
    {
        "id": 3481,
        "title": "SEGUNDA VUELTA ELECCIONES DEL COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA",
        "start": "13/01/2026",
        "end": "13/01/2026",
        "fechai": "13/01/2026",
        "fechaf": "13/01/2026",
        "horai": "08:00:00",
        "horaf": "18:00:00",
        "estimado": 4000,
        "parqueosDisponibles": 539,
        "extendedProps": {
            "descripcion": "CANG",
            "propietario": "COLEGIO DE ABOGADO Y NOTARIO DE GUATEMALA",
            "lugar": "parque de la industria",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.52219586915909,
            "latitud": 14.609074732438613
        },
        "parqueos": [
            {
                "id": 1881,
                "descripcion": "TORRE CRISTAL",
                "direccion": "sexta calle y quinta avenida, zona 9, ciudad de Guatemala",
                "capacidad": 200,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.523159525681,
                "latitud": 14.607952378624
            },
            {
                "id": 921,
                "descripcion": "Parqueo parque de la Industria",
                "direccion": "Parque de la industria ",
                "capacidad": 539,
                "reservados": 539,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5231595256812,
                "latitud": 14.607952378624196
            },
            {
                "id": 442,
                "descripcion": "Parqueo Turitran",
                "direccion": "2 avenida 8 calle",
                "capacidad": 400,
                "reservados": 0,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52398967678951,
                "latitud": 14.606277812660238
            }
        ],
        "muni": 1
    },
    {
        "id": 3781,
        "title": "TRIBUTO HÉROES DEL SILENCIO SINFÓNICO",
        "start": "12/02/2026",
        "end": "12/02/2026",
        "fechai": "12/02/2026",
        "fechaf": "12/02/2026",
        "horai": "20:00:00",
        "horaf": "23:00:00",
        "estimado": 300,
        "parqueosDisponibles": 100,
        "extendedProps": {
            "descripcion": "Concierto tributo a la banda española Héroes del Silecio",
            "propietario": "NiuMark, S.A.",
            "lugar": "Teatro Lux",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.51457643508913,
            "latitud": 14.63811220553562
        },
        "parqueos": [
            {
                "id": 681,
                "descripcion": "Torre de Estacionamientos",
                "direccion": "5a. avenida y 11 calle zona 1",
                "capacidad": 180,
                "reservados": 100,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.51523089408876,
                "latitud": 14.638111167571472
            }
        ],
        "muni": 1
    },
    {
        "id": 3822,
        "title": "NOCHE ENCANTADA",
        "start": "14/02/2026",
        "end": "15/02/2026",
        "fechai": "14/02/2026",
        "fechaf": "15/02/2026",
        "horai": "18:00:00",
        "horaf": "00:00:00",
        "estimado": 400,
        "parqueosDisponibles": 300,
        "extendedProps": {
            "descripcion": "Cena romántica",
            "propietario": "Eventos Yee",
            "lugar": "18 avenida 19-08 condominio alcazar de santa amelia zona 16 casa 3B, atrás del hospital militar",
            "oficio": null,
            "chapa": null,
            "status": "ACTIVO",
            "tipo": "Otros",
            "categoria": "Eventos no relacionados con las descripciones anteriores.",
            "foto": null,
            "longitud": -90.522983,
            "latitud": 14.6083105
        },
        "parqueos": [
            {
                "id": 2242,
                "descripcion": "PARQUEO PARQUE DE LA INDUSTRIA",
                "direccion": "Parque de la industria ",
                "capacidad": 350,
                "reservados": 300,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5230156,
                "latitud": 14.6083527
            }
        ],
        "muni": 1
    },
    {
        "id": 1384,
        "title": "MUNICIPAL VS REAL ESPAÑA",
        "start": "13/08/2025",
        "end": "13/08/2025",
        "fechai": "13/08/2025",
        "fechaf": "13/08/2025",
        "horai": "20:00:00",
        "horaf": "22:00:00",
        "estimado": 9998,
        "parqueosDisponibles": 0,
        "extendedProps": {
            "descripcion": "COPA CENTROAMERICANA CONCACAF",
            "propietario": "CONCACAF",
            "lugar": "ESTADIO EL TRÉBOL",
            "oficio": null,
            "chapa": null,
            "status": "CANCELADO",
            "tipo": "Deportivos",
            "categoria": "Competencias y actividades físicas que promueven el deporte y la salud, tales como maratones, torneos deportivos y clases de fitness al aire libre.",
            "foto": null,
            "longitud": -90.53476274013519,
            "latitud": 14.616862072899602
        },
        "parqueos": [],
        "muni": 1
    },
    {
        "id": 3601,
        "title": "NICKY JAM",
        "start": "31/01/2026",
        "end": "31/01/2026",
        "fechai": "31/01/2026",
        "fechaf": "31/01/2026",
        "horai": "18:00:00",
        "horaf": "23:30:00",
        "estimado": 3000,
        "parqueosDisponibles": 2500,
        "extendedProps": {
            "descripcion": "Cantante de regueton dando concierto de sus mejores exitos",
            "propietario": "JUAN PABLO  BUCARO CASTRO",
            "lugar": "12 avenida y calle mariscal zona 5, ciudad de Guatemala",
            "oficio": null,
            "chapa": null,
            "status": "CANCELADO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.50960898399354,
            "latitud": 14.615795847889908
        },
        "parqueos": [
            {
                "id": 2046,
                "descripcion": "CAMPO MARTE",
                "direccion": "Circunvalación Campo Marte, zona 5 ciudad de Guatemala",
                "capacidad": 1000,
                "reservados": 1000,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.573049686487,
                "latitud": 14.627376886459
            },
            {
                "id": 2181,
                "descripcion": "PARQUEO ALEDAñO EXPLANADA 5",
                "direccion": "12 avenida calle mariscal ",
                "capacidad": 1500,
                "reservados": 1500,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.573049686487,
                "latitud": 14.627376886459
            }
        ],
        "muni": 1
    },
    {
        "id": 2601,
        "title": "TITO NIEVES",
        "start": "01/11/2025",
        "end": "01/11/2025",
        "fechai": "01/11/2025",
        "fechaf": "01/11/2025",
        "horai": "19:00:00",
        "horaf": "23:30:00",
        "estimado": 1500,
        "parqueosDisponibles": 700,
        "extendedProps": {
            "descripcion": "evento para publico joven adulto tipo concierto",
            "propietario": "MENCIONESS S.A.",
            "lugar": "ANILLO PERIFÉRICO 27 AVENIDA 6-40, ZONA 11.",
            "oficio": null,
            "chapa": null,
            "status": "CANCELADO",
            "tipo": "Entretenimiento",
            "categoria": "Eventos que proporcionan diversión y recreación, como conciertos, películas al aire libre y espectáculos en vivo.",
            "foto": null,
            "longitud": -90.56043483296419,
            "latitud": 14.621125407288858
        },
        "parqueos": [
            {
                "id": 1541,
                "descripcion": "PARQUEO FORUM MAJADAS",
                "direccion": "Anillo Periférico. 27 avenida 6-40, zona 11",
                "capacidad": 300,
                "reservados": 300,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.52128,
                "latitud": 14.584895
            },
            {
                "id": 1542,
                "descripcion": "MAJADAS ONCE",
                "direccion": "ANILLO PERIFÉRICO 27 AVENIDA 6-40, ZONA 11.",
                "capacidad": 400,
                "reservados": 400,
                "observaciones": null,
                "ruta_foto": null,
                "longitud": -90.5604319853108,
                "latitud": 14.621114106654517
            }
        ],
        "muni": 1
    }
];

  if (loading) {
    return (
      <div className={classNames(styles.Page)}>
        <p>Cargando eventos...</p>
      </div>
    );
  }

  return (
    <>
      <Calendar events={activeEvents} />

      {mapEvents.length > 0 ? (
        <Map events={mapEvents} />
      ) : (
        <p className={classNames(styles.NoEventsMessage)}>
          No hay eventos activos con ubicación disponible para mostrar en el
          mapa.
        </p>
      )}
    </>
  );
}


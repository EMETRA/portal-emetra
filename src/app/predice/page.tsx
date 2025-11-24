/* eslint-disable @next/next/no-img-element */
import { addMonths, isAfter, isBefore, parse, startOfDay } from "date-fns";
import Map from "@/components/client/atoms/Map";
import { Metadata } from "next";
import Image from "next/image";
import classNames from "classnames";
import styles from "./Page.module.scss";
import Calendar from "@/components/server/molecules/Calendar/Calendar";
import Link from "next/link";
import {
  fetchPrediceEvents,
  PrediceEventDto,
} from "@/lib/predice/api";

const today = startOfDay(new Date());
const twoMonthsLater = addMonths(today, 2);

export const metadata: Metadata = {
  title: "Predice",
  icons: {
    icon: "/images/Predice.ico",
  },
};

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

export default async function Page() {
  const events = await fetchPrediceEvents();
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

  return (
    <div className={classNames(styles.Page)}>
      <div className={classNames(styles.Header)}>
        <Image
          src={"/images/Predice.ico"}
          height={75}
          width={75}
          alt="Logotipo de Predice"
        />
        <h1>PREDICE</h1>
      </div>

      <div className={classNames(styles.AddEventRow)}>
        <Link
          href="/predice/nuevo"
          className={classNames(styles.AddEventButton)}
        >
          Agregar evento
        </Link>
      </div>

      <Calendar events={activeEvents} />

      {mapEvents.length > 0 ? (
        <Map events={mapEvents} />
      ) : (
        <p className={classNames(styles.NoEventsMessage)}>
          No hay eventos activos con ubicación disponible para mostrar en el
          mapa.
        </p>
      )}

      <h4>En colaboración con:</h4>
      <div className={classNames(styles.LogosRow)}>
        <img
          src="/images/Amatitlan.png"
          alt="Escudo de la Municipalidad de Amatitlán"
          title="Escudo de la Municipalidad de Amatitlán"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Escuintla.png"
          alt="Escudo de la Municipalidad de Escuintla"
          title="Escudo de la Municipalidad de Escuintla"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Fraijanes.png"
          alt="Escudo de la Municipalidad de Fraijanes"
          title="Escudo de la Municipalidad de Fraijanes"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Mixco.png"
          alt="Escudo de la Municipalidad de Mixco"
          title="Escudo de la Municipalidad de Mixco"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Guatemala.png"
          alt="Escudo de la Municipalidad de Guatemala"
          title="Escudo de la Municipalidad de Guatemala"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Petapa.png"
          alt="Escudo de la Municipalidad de San Miguel Petapa"
          title="Escudo de la Municipalidad de San Miguel Petapa"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Sur.png"
          alt="Escudo de la Mancomunidad Gran Ciudad del Sur"
          title="Escudo de la Mancomunidad Gran Ciudad del Sur"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/VC.png"
          alt="Escudo de la Municipalidad de Villa Canales"
          title="Escudo de la Municipalidad de Villa Canales"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/VN.png"
          alt="Escudo de la Municipalidad de Villa Nueva"
          title="Escudo de la Municipalidad de Villa Nueva"
          className={classNames(styles.LogoImg)}
        />
      </div>
    </div>
  );
}

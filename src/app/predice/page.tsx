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
  fetchPrediceEventsWithDebug,
  PrediceEventDto,
  FetchPrediceEventsDebugInfo,
} from "@/lib/predice/api";

const today = startOfDay(new Date());
const twoMonthsLater = addMonths(today, 2);

export const dynamic = "force-dynamic";

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

interface DebugPanelProps {
  debug: FetchPrediceEventsDebugInfo;
}

function DebugPanel({ debug }: DebugPanelProps) {
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("es-GT", {
        dateStyle: "medium",
        timeStyle: "medium",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className={classNames(styles.DebugPanel)}>
      <h3 className={classNames(styles.DebugTitle)}>Debug: Fetch de Eventos</h3>
      <div className={classNames(styles.DebugContent)}>
        <div className={classNames(styles.DebugItem)}>
          <span className={classNames(styles.DebugLabel)}>URL:</span>
          <span className={classNames(styles.DebugValue)}>{debug.url}</span>
        </div>
        <div className={classNames(styles.DebugItem)}>
          <span className={classNames(styles.DebugLabel)}>Timestamp:</span>
          <span className={classNames(styles.DebugValue)}>
            {formatTimestamp(debug.timestamp)}
          </span>
        </div>
        <div className={classNames(styles.DebugItem)}>
          <span className={classNames(styles.DebugLabel)}>Status HTTP:</span>
          <span
            className={classNames(
              styles.DebugValue,
              debug.ok ? styles.DebugSuccess : styles.DebugError,
            )}
          >
            {debug.status} {debug.ok ? "OK" : "ERROR"}
          </span>
        </div>
        <div className={classNames(styles.DebugItem)}>
          <span className={classNames(styles.DebugLabel)}>Total Eventos:</span>
          <span className={classNames(styles.DebugValue)}>
            {debug.totalEvents}
          </span>
        </div>
        <div className={classNames(styles.DebugItem)}>
          <span className={classNames(styles.DebugLabel)}>Eventos Activos:</span>
          <span className={classNames(styles.DebugValue)}>
            {debug.activeEvents}
          </span>
        </div>
        {debug.error && (
          <div className={classNames(styles.DebugItem)}>
            <span className={classNames(styles.DebugLabel)}>Error:</span>
            <span className={classNames(styles.DebugValue, styles.DebugError)}>
              {debug.error}
            </span>
          </div>
        )}
      </div>
      {debug.sampleEvent && (
        <div className={classNames(styles.DebugItem)}>
          <span className={classNames(styles.DebugLabel)}>Ejemplo de Evento:</span>
          <div className={classNames(styles.DebugSample)}>
            <pre className={classNames(styles.DebugPre)}>
              {JSON.stringify(debug.sampleEvent, null, 2)}
            </pre>
          </div>
        </div>
      )}
      <details className={classNames(styles.DebugDetails)}>
        <summary className={classNames(styles.DebugSummary)}>
          Ver información de debug completa
        </summary>
        <pre className={classNames(styles.DebugPre)}>
          {JSON.stringify(debug, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default async function Page() {
  const { events, debug } = await fetchPrediceEventsWithDebug();
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

      <DebugPanel debug={debug} />

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

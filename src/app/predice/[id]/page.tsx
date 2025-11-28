"use client";

import Map from "@/components/client/atoms/Map";
import Link from "next/link";
import classNames from "classnames";
import styles from "./Page.module.scss";
import {
  fetchPrediceEventByIdClient,
  type PrediceEventDto,
} from "@/lib/predice/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getDateFromEvent(event: PrediceEventDto) {
  return event.start ?? event.fechai ?? null;
}

function getEndDateFromEvent(event: PrediceEventDto) {
  return event.end ?? event.fechaf ?? null;
}

function formatDateWithLocale(date: string | null) {
  if (!date) return "Fecha no disponible";
  const [day, month, year] = date.split("/");
  if (!day || !month || !year) return date;
  try {
    const formatted = format(
      new Date(Number(year), Number(month) - 1, Number(day)),
      "d 'de' MMMM 'de' yyyy",
      { locale: es },
    );
    return formatted;
  } catch {
    return date;
  }
}

function formatTimeSpan(start?: string | null, end?: string | null) {
  if (!start && !end) {
    return "Horario no disponible";
  }
  const normalizedStart = start ? start.slice(0, 5) : null;
  const normalizedEnd = end ? end.slice(0, 5) : null;
  if (normalizedStart && normalizedEnd) {
    return `${normalizedStart} - ${normalizedEnd}`;
  }
  return normalizedStart ?? normalizedEnd ?? "Horario no disponible";
}

function parseNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const [event, setEvent] = useState<PrediceEventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadEvent() {
      try {
        const fetchedEvent = await fetchPrediceEventByIdClient(id);
        if (!fetchedEvent) {
          setNotFound(true);
        } else {
          setEvent(fetchedEvent);
        }
      } catch (error) {
        console.error("Error al cargar el evento:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className={classNames(styles.Page)}>
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className={classNames(styles.Page)}>
        <p>Evento no encontrado</p>
        <Link href="/predice" className={classNames(styles.BackLink)}>
          ← Volver
        </Link>
      </div>
    );
  }

  const title = decodeHtmlEntities(event.title);
  const description =
    event.extendedProps?.descripcion ?? "Sin descripción disponible.";
  const owner = event.extendedProps?.propietario ?? "No especificado";
  const location = event.extendedProps?.lugar ?? "No especificado";
  const type = event.extendedProps?.tipo ?? "Sin tipo asignado";
  const category = event.extendedProps?.categoria ?? "Sin categoría asignada";
  const status = event.extendedProps?.status ?? "Sin estado";
  const aforo = parseNumber(event.estimado);
  const parqueosDisponibles = parseNumber(event.parqueosDisponibles);
  const telefono = event.telefono ?? "No registrado";
  const correo = event.correo ?? "No registrado";

  const eventCoordinates = {
    lat: event.extendedProps?.latitud,
    lng: event.extendedProps?.longitud,
  };

  const mapEvents =
    typeof eventCoordinates.lat === "number" &&
    typeof eventCoordinates.lng === "number"
      ? [
          {
            id: String(event.id),
            name: title,
            lat: eventCoordinates.lat,
            lng: eventCoordinates.lng,
            start: getDateFromEvent(event) ?? undefined,
            end: getEndDateFromEvent(event) ?? undefined,
            horai: event.horai ?? undefined,
            horaf: event.horaf ?? undefined,
            aforo: aforo ?? undefined,
            parqueosDisponibles: parqueosDisponibles ?? undefined,
          },
        ]
      : [];

  return (
    <div className={classNames(styles.Page)}>
      <Link href="/predice" className={classNames(styles.BackLink)}>
        ← Volver
      </Link>

      <header className={classNames(styles.Header)}>
        <h1 className={classNames(styles.Title)}>{title}</h1>
        <h2 className={classNames(styles.Subtitle)}>ID #{event.id}</h2>
      </header>

      <section className={classNames(styles.Meta)}>
        <div className={classNames(styles.MetaItem)}>
          <span className={classNames(styles.MetaLabel)}>Fecha</span>
          <span className={classNames(styles.MetaValue)}>
            {formatDateWithLocale(getDateFromEvent(event))}
          </span>
        </div>
        <div className={classNames(styles.MetaItem)}>
          <span className={classNames(styles.MetaLabel)}>Fin</span>
          <span className={classNames(styles.MetaValue)}>
            {formatDateWithLocale(getEndDateFromEvent(event))}
          </span>
        </div>
        <div className={classNames(styles.MetaItem)}>
          <span className={classNames(styles.MetaLabel)}>Horario</span>
          <span className={classNames(styles.MetaValue)}>
            {formatTimeSpan(event.horai, event.horaf)}
          </span>
        </div>
        <div className={classNames(styles.MetaItem)}>
          <span className={classNames(styles.MetaLabel)}>Aforo estimado</span>
          <span className={classNames(styles.MetaValue)}>
            {aforo !== null ? aforo : "No registrado"}
          </span>
        </div>
        <div className={classNames(styles.MetaItem)}>
          <span className={classNames(styles.MetaLabel)}>
            Parqueos disponibles
          </span>
          <span className={classNames(styles.MetaValue)}>
            {parqueosDisponibles !== null
              ? parqueosDisponibles
              : "No registrado"}
          </span>
        </div>
      </section>

      <section className={classNames(styles.Section)}>
        <h3 className={classNames(styles.SectionTitle)}>Descripción</h3>
        <p>{description}</p>
      </section>

      <section className={classNames(styles.Section)}>
        <h3 className={classNames(styles.SectionTitle)}>Detalles del evento</h3>
        <div className={classNames(styles.TagGroup)}>
          <span className={classNames(styles.Tag)}>Responsable: {owner}</span>
          <span className={classNames(styles.Tag)}>Lugar: {location}</span>
          <span className={classNames(styles.Tag)}>Tipo: {type}</span>
          <span className={classNames(styles.Tag)}>Categoría: {category}</span>
          <span className={classNames(styles.Tag)}>Estado: {status}</span>
        </div>
      </section>

      <section className={classNames(styles.Section)}>
        <h3 className={classNames(styles.SectionTitle)}>Contacto</h3>
        <div className={classNames(styles.TagGroup)}>
          <span className={classNames(styles.Tag)}>Teléfono: {telefono}</span>
          <span className={classNames(styles.Tag)}>Correo: {correo}</span>
        </div>
      </section>

      <section className={classNames(styles.Section)}>
        <h3 className={classNames(styles.SectionTitle)}>Parqueos</h3>
        {event.parqueos && event.parqueos.length > 0 ? (
          <div className={classNames(styles.Parkings)}>
            {event.parqueos.map((parking) => (
              <article
                key={`${parking.id}-${parking.descripcion}`}
                className={classNames(styles.ParkingCard)}
              >
                <h4>{parking.descripcion ?? "Parqueo sin nombre"}</h4>
                <p>
                  <strong>Dirección:</strong>{" "}
                  {parking.direccion ?? "No registrada"}
                </p>
                <p>
                  <strong>Capacidad:</strong>{" "}
                  {parseNumber(parking.capacidad) ?? "N/D"}
                </p>
                <p>
                  <strong>Reservados:</strong>{" "}
                  {parseNumber(parking.reservados) ?? "N/D"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className={classNames(styles.EmptyState)}>
            No hay parqueos registrados para este evento.
          </p>
        )}
      </section>

      {mapEvents.length > 0 ? (
        <div className={classNames(styles.MapWrapper)}>
          <Map events={mapEvents} />
        </div>
      ) : (
        <p className={classNames(styles.EmptyState)}>
          No se encontró la ubicación geográfica del evento para mostrar en el
          mapa.
        </p>
      )}
    </div>
  );
}

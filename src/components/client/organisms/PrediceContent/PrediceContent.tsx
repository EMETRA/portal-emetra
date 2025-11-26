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


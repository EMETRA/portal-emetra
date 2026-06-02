"use client";

import { useEffect, useState } from "react";
import CalendarWidget from "@/components/server/molecules/CalendarWidget/CalendarWidget";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";
import { assertOkResponse } from "@/lib/bff/raw";
import type { PrediceEventDto } from "@/lib/predice/types";

const PREDICE_API = "/api/predice/eventos?admin=admin";

export default function CalendarWidgetFetcher() {
  const [events, setEvents] = useState<PrediceEventDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const response = await fetch(PREDICE_API, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        await assertOkResponse(response);
        const data = (await response.json()) as PrediceEventDto[];
        setEvents(Array.isArray(data) ? data : []);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar los eventos del calendario.";
        setError(message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (error) {
    return (
      <ServiceErrorAlert title="Predice no disponible" message={error} />
    );
  }

  if (loading) {
    return null;
  }

  return <CalendarWidget events={events} />;
}

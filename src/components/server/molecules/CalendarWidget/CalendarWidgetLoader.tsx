import { fetchPrediceEventsServer } from "@/lib/predice/server";
import { getUserErrorMessage } from "@/lib/api/errors";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";
import CalendarWidget from "./CalendarWidget";

export const dynamic = "force-dynamic";

export default async function CalendarWidgetLoader() {
  try {
    const events = await fetchPrediceEventsServer();
    return <CalendarWidget events={events} />;
  } catch (error) {
    return (
      <ServiceErrorAlert
        title="Predice no disponible"
        message={getUserErrorMessage(
          error,
          "No se pudieron cargar los eventos del calendario."
        )}
      />
    );
  }
}

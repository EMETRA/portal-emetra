import { fetchPrediceEventsServer } from "@/lib/predice/server";
import CalendarWidget from "./CalendarWidget";

export const dynamic = "force-dynamic";

export default async function CalendarWidgetLoader() {
  const events = await fetchPrediceEventsServer();
  return <CalendarWidget events={events} />;
}

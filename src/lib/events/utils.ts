import type { PrediceEventDto } from "@/lib/predice/types";

export function isActiveEvent(event: PrediceEventDto): boolean {
  return (
    Boolean(event.extendedProps) &&
    event.extendedProps?.status === "ACTIVO" &&
    typeof event.start === "string"
  );
}

export function buildEventCountByDate(
  events: PrediceEventDto[],
  year: number,
  month: number
): Record<string, number> {
  return events.filter(isActiveEvent).reduce<Record<string, number>>(
    (acc, event) => {
      const start = event.start;
      if (!start) {
        return acc;
      }
      const [day, eventMonth, eventYear] = start.split("/");
      if (parseInt(eventYear, 10) === year && parseInt(eventMonth, 10) - 1 === month) {
        const key = `${year}-${eventMonth.padStart(2, "0")}-${day.padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    },
    {}
  );
}

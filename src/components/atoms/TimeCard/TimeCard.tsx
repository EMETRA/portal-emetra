import type { TimeCardProps } from "./types";
import styles from "./TimeCard.module.scss";
import classNames from "classnames";
import { Clock } from "lucide-react";

export default function TimeCard({ time, hour, averageTime }: TimeCardProps) {
  const formatTime = (time: number) => {
    const rounded = Math.round(time);
    if (rounded >= 60) {
      const hours = Math.floor(rounded / 60);
      const minutes = rounded % 60;
      return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
    }
    return `${rounded} min`;
  };

  const parseDMY = (str: string): Date | null => {
    if (!str) return null;
    const parts = str.split(" ");
    if (parts.length !== 2) return null;

    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    if ([day, month, year, hours, minutes, seconds].some(isNaN)) return null;

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const formatHour = (hourStr?: string) => {
    const date = parseDMY(hourStr || "");
    if (!date) return "Fecha inválida";

    const today = new Date();
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (isToday) {
      return `Última actualización a las ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `Última actualización: ${date.toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} a las ${date.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const subtitle = "Tiempo estimado";
  const difference =
    averageTime !== undefined &&
    averageTime !== null &&
    time !== undefined &&
    time !== null
      ? Math.round(averageTime - time)
      : null;

  return (
    <div className={classNames(styles.card)}>
      <div className={classNames(styles.iconContainer)}>
        <Clock className={classNames(styles.icon)} />
      </div>
      <div>
        <p className={classNames(styles.subtitle)}>{subtitle}</p>
        <p className={classNames(styles.title)}>
          {time !== undefined && time !== null ? formatTime(time) : "Sin datos"}
        </p>
        {difference !== null && difference !== 0 && (
          <p
            className={classNames(
              styles.difference,
              difference < 0 ? styles.worsened : styles.improved
            )}
          >
            {`(${Math.abs(difference)} minutos más ${
              difference < 0 ? "lento" : "rápido"
            } que lo usual)`}
          </p>
        )}
        {hour && <p className={classNames(styles.note)}>{formatHour(hour)}</p>}
      </div>
    </div>
  );
}

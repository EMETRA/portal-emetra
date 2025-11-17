"use client";
import React, { useState } from "react";
import Cell from "@/components/server/atoms/CalendarCell/CalendarCell";
import styles from "./Calendar.module.scss";
import { events } from "@/data/local/examples/event";
import { Icon } from "../../atoms";
import Link from "next/link";

const daysShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const activeEventsByDate = events.data
  .filter(
    (e) =>
      e.extendedProps &&
      e.extendedProps.status === "ACTIVO" &&
      typeof e.start === "string"
  )
  .reduce<Record<string, typeof events.data>>((acc, e) => {
    const [day, month, year] = e.start.split("/");
    const key = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

const Calendar: React.FC<{
  initialDate?: Date;
}> = ({ initialDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const firstDay = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDay });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className={styles.CalendarWrapper}>
      <div className={styles.Calendar}>
        <div className={styles.Header}>
          <button
            className={styles.NavButton}
            onClick={handlePrevMonth}
            aria-label="Mes anterior"
            type="button"
          >
            <Icon name="Down" className={styles.Left} />
          </button>
          <span className={styles.MonthLabel}>
            {currentDate.toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className={styles.NavButton}
            onClick={handleNextMonth}
            aria-label="Mes siguiente"
            type="button"
          >
            <Icon name="Down" className={styles.Right} />
          </button>
        </div>
        <div className={styles.CalendarScroll}>
          <div className={styles.CalendarInner}>
            <div className={styles.Weekdays}>
              {daysShort.map((d) => (
                <span key={d} className={styles.Weekday}>
                  {d}
                </span>
              ))}
            </div>
            <div className={styles.Grid}>
              {blanks.map((_, i) => (
                <span key={`blank-${i}`} className={styles.Blank} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = new Date(year, month, i + 1);
                const key = date.toISOString().slice(0, 10);
                const dayEvents = activeEventsByDate[key] || [];
                return (
                  <Cell
                    key={date.toISOString()}
                    date={date}
                    className={dayEvents.length > 0 ? "hasEvents" : undefined}
                  >
                    <span className={styles.DayNumber}>{date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <ul className={styles.EventList}>
                        {dayEvents.map((ev) => (
                          <li key={ev.id} className={styles.EventListItem}>
                            <span
                              className={styles.EventBullet}
                              aria-hidden="true"
                            />
                            <Link
                              href={`/predice/${ev.id}`}
                              className={styles.EventTitle}
                              dangerouslySetInnerHTML={{ __html: ev.title }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Cell>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

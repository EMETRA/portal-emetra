/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

"use client";
import React from "react";
import Link from "next/link";
import styles from "./CalendarWidget.module.scss";
import { events } from "@/data/local/examples/event";
import classNames from "classnames";

const daysShort = ["D", "L", "M", "X", "J", "V", "S"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getEventsByDate(year: number, month: number) {
  return events.data
    .filter(
      (e) =>
        e.extendedProps &&
        e.extendedProps.status === "ACTIVO" &&
        typeof e.start === "string"
    )
    .reduce<Record<string, number>>((acc, e) => {
      const [day, m, y] = e.start.split("/");
      if (parseInt(y) === year && parseInt(m) - 1 === month) {
        const key = `${year}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});
}

const CalendarWidget: React.FC = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDay });
  const eventsByDate = getEventsByDate(year, month);

  return (
    <Link href="/predice" className={styles.WidgetLink}>
      <div className={classNames(styles.Heading)}>
        <img
          src={"/images/Predice.png"}
          className={classNames(styles.Predice)}
        />
        <h3 className={classNames(styles.Title)}>Predice</h3>
      </div>
      <div className={styles.MiniCalendar}>
        <div className={styles.Header}>
          {today.toLocaleString("es-ES", { month: "long", year: "numeric" })}
        </div>
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
            const eventCount = eventsByDate[key] || 0;
            return (
              <span key={key} className={styles.Cell}>
                <span className={styles.DayNumber}>{i + 1}</span>
                {eventCount > 0 && (
                  <span className={styles.Dots}>
                    {eventCount > 4 ? (
                      <>
                        {[...Array(3)].map((_, idx) => (
                          <span key={idx} className={styles.Dot} />
                        ))}
                        <span className={styles.More}>+</span>
                      </>
                    ) : (
                      Array.from({ length: eventCount }).map((_, idx) => (
                        <span key={idx} className={styles.Dot} />
                      ))
                    )}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

export default CalendarWidget;

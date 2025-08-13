import React from "react";
import classNames from "classnames";
import styles from "./CalendarCell.module.scss";

interface CellProps {
  date: Date;
  children?: React.ReactNode;
  className?: string;
}

const Cell: React.FC<CellProps> = ({ date, children, className }) => {
  const isToday = (() => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  })();

  return (
    <div
      className={classNames(styles.Cell, className, {
        [styles.today]: isToday,
      })}
    >
      {children ?? date.getDate()}
      {isToday && <span className={styles.TodayLabel}>HOY</span>}
    </div>
  );
};

export default Cell;

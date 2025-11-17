"use client";

import { TrafficChartProps } from "./types";
import styles from "./TrafficChart.module.scss";
import classNames from "classnames";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TrafficChart({ data }: TrafficChartProps) {
  // Agrupar por día y sumar tiempos
  const aggregatedData = Object.values(
    data.reduce((acc, curr) => {
      const day = curr.day.trim(); // evita espacios
      if (!acc[day]) {
        acc[day] = { day, tiempo: 0 };
      }
      acc[day].tiempo += Math.round(curr.time);
      return acc;
    }, {} as Record<string, { day: string; tiempo: number }>)
  );

  const maxTime = Math.max(...aggregatedData.map((d) => d.tiempo));

  return (
    <div className={classNames(styles.container)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={aggregatedData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
            formatter={(value: number) => `${value} min`}
          />
          <Bar dataKey="tiempo" radius={[6, 6, 0, 0]}>
            {aggregatedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.tiempo === maxTime ? "#ef4444" : "#60a5fa"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

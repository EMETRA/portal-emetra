"use client";

import { TrafficChartProps } from "./types";
import styles from './TrafficChart.module.scss';
import classNames from "classnames";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrafficChart({data}: TrafficChartProps) {

    const maxTime = Math.max(...data.map(d => d.time));

    return (
        <div className={classNames(styles.container)}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip contentStyle={{backgroundColor: "#fff", borderRadius: "8px"}} />
                    <Bar dataKey="time" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.time === maxTime ? "#ef4444" : "#60a5fa"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

};
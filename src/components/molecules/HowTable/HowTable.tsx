import React from 'react';
import styles from './HowTable.module.scss';
import { assert } from 'console';
import type { Cell, HowTableProps } from './types';


function isDark(hex?: string): boolean {
    if (!hex) return false;
    const c = hex.replace('#', '');
    const full = c.length === 3 ? c.split('').map((ch) => ch + ch).join('') : c;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 140;
}

export default function HowTable({ columns, rows, rowColors = [], className }: HowTableProps) {
    const colCount = Math.max(1, columns.length, ...rows.map((r) => r.length))
    const singleCol = colCount === 1 ? styles.singleCol :'';
    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            <div className={`${styles.table} ${singleCol}`} style={{ ['--cols' as any]: colCount }}>
                <div className={styles.header}>
                    {columns.map((col, i) => (
                        <div key={i} className={styles.headerCell}>
                            {col}
                        </div>
                    ))}
                </div>

                {rows.map((row, i) => {
                    const bg = rowColors[i] || 'transparent';
                    const dark = isDark(bg);
                    return (
                        <div key={i} className={`${styles.row} ${dark ? styles.rowDark : ""}`} style={{backgroundColor: bg}} >
                            {Array.from({ length: colCount }).map((_, j) => {
                                const cell = row[j] || ({} as Cell)
                                return (
                                    <div key={j} className={styles.cell}>
                                        <div className={styles.title}><span className={styles.text}> {cell.title || ""} </span> </div>
                                        {cell.note ? (
                                            <div className={styles.note}><span className={styles.text}>{cell.note}</span>  </div>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    );
                })}

            </div>
        </div>
    )
}

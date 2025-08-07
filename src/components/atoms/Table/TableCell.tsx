import React from 'react'
import styles from './Table.module.scss'

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = props => (
    <td className={styles.cell} {...props} />
)

export const TableHeaderCell: React.FC<React.ThHTMLAttributes<HTMLTableHeaderCellElement>> = props => (
    <th className={styles.headerCell} {...props} />
)

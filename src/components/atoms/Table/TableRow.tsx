import React from 'react'
import styles from './Table.module.scss'

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = props => (
    <tr className={styles.row} {...props} />
)

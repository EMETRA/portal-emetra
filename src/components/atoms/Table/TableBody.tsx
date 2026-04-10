import React from 'react'
import styles from './Table.module.scss'

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = props => (
    <tbody className={styles.body} {...props} />
)

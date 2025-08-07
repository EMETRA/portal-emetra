import React from 'react'
import styles from './Table.module.scss'

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = props => (
    <thead className={styles.head} {...props} />
)

import React from 'react'
import styles from './Table.module.scss'

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = props => (
    <table className={styles.table} {...props} />
)

import React from 'react'
import styles from './StatusBadge.module.scss'
import type { StatusBadgeProps } from './types'


const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const key = status.toLowerCase().replace(/\s+/g, '')
    const variantClass = styles[`badge--${key}`] || ''
    return <span className={`${styles.badge} ${variantClass}`}>{status}</span>
}

export default StatusBadge
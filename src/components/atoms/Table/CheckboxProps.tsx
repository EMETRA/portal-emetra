import React from 'react'
import styles from './Table.module.scss'

interface CheckboxProps {
    checked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => (
    <input
        className={styles.checkbox}
        type="checkbox"
        checked={checked}
        onChange={onChange}
    />
)

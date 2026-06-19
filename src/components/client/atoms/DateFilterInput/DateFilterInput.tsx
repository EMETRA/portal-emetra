import { useRef } from "react";
import styles from "./DateFilterInput.module.scss";

interface DateFilterInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function DateFilterInput({
    label = "Buscar por fecha",
    value,
    onChange,
    }: DateFilterInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const openPicker = () => {
        const input = inputRef.current as
        | (HTMLInputElement & { showPicker?: () => void })
        | null;
        if (input?.showPicker) {
        input.showPicker();
        } else {
        input?.focus();
        }
    };

    return (
        <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        <div className={styles.wrapper} onClick={openPicker}>
            <input
            ref={inputRef}
            type="date"
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            />
            <svg
            className={styles.icon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            >
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
        </div>
    );
}
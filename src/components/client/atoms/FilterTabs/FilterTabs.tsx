import styles from "./FilterTabs.module.scss";

interface FilterTabOption<T extends string> {
    value: T;
    label: string;
}

interface FilterTabsProps<T extends string> {
    options: FilterTabOption<T>[];
    value: T;
    onChange: (value: T) => void;
}

export default function FilterTabs<T extends string>({
    options,
    value,
    onChange,
    }: FilterTabsProps<T>) {
    return (
        <div className={styles.tabs}>
        {options.map((opt) => (
            <button
            key={opt.value}
            type="button"
            className={`${styles.tab} ${value === opt.value ? styles.active : ""}`}
            onClick={() => onChange(opt.value)}
            >
            {opt.label}
            </button>
        ))}
        </div>
    );
}
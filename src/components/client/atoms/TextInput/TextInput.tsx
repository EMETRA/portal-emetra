import classNames from "classnames";
import styles from "./TextInput.module.scss";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function TextInput({ value, onChange, placeholder, className }: TextInputProps) {
    return (
        <input
        type="text"
        className={classNames(styles.input, className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        />
    );
}
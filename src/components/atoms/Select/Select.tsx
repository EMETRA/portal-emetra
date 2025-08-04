import React from "react";
import classNames from "classnames";
import styles from "./Select.module.scss";
import type { SelectProps } from "./types";

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Seleccione...",
  className,
  ...props
}) => (
  <div className={styles.container}>
    <select className={classNames(styles.select, className)} {...props}>
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {/* Aquí podrías poner un icono de flecha si quisieras */}
  </div>
);

export default Select;

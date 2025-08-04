import React from "react";
import classNames from "classnames";
import styles from "./RadioGroup.module.scss";
import type { RadioGroupProps } from "./types";

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selected,
  onChange,
  className,
}) => (
  <div className={classNames(styles.radioGroup, className)}>
    {options.map(opt => (
      <label key={opt.value} className={styles.option}>
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={opt.value === selected}
          onChange={() => onChange(opt.value)}
        />
        <span>{opt.label}</span>
      </label>
    ))}
  </div>
);

export default RadioGroup;

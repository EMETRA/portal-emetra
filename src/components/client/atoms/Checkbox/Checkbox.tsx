"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import classNames from "classnames";
import { Icon } from "@/components/server/atoms/Icon";
import styles from "./Checkbox.module.scss";
import { CheckboxProps } from "./types";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      errorMessage,
      label,
      id,
      size = 20,
      disabled,
      ...props
    },
    ref,
  ) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => checkboxRef.current as HTMLInputElement, []);

    const checkboxId = id || `checkbox-${label}`;

    return (
      <div className={styles.wrapper}>
        <label
          htmlFor={checkboxId}
          className={classNames(
            styles.container,
            errorMessage && styles.containerError,
            disabled && styles.containerDisabled,
            className,
          )}
        >
          <input
            ref={checkboxRef}
            type="checkbox"
            id={checkboxId}
            className={styles.input}
            disabled={disabled}
            {...props}
          />
          <span className={styles.mark} style={{ width: size, height: size }}>
            <Icon
              name="Unchecked"
              width={size}
              height={size}
              className={styles.unchecked}
              aria-hidden
            />
            <Icon
              name="Checked"
              width={size}
              height={size}
              className={styles.checked}
              aria-hidden
            />
          </span>
          {label && <span className={styles.label}>{label}</span>}
        </label>
        {errorMessage && (
          <span className={styles.errorMessage}>{errorMessage}</span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

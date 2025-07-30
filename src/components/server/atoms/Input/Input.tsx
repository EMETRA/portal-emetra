"use client";
import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./Input.module.scss";
import classNames from "classnames";
import { InputProps } from "./types";
import { Icon } from "../Icon";

/**
 * Componente de entrada reutilizable que admite tipos de entrada de texto, contraseña y fecha.
 *
 * @param {InputProps} props - Las propiedades del componente de entrada.
 * @returns {JSX.Element} El componente de entrada renderizado.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    // Estado para controlar la visibilidad de la contraseña.
    const [showPassword, setShowPassword] = useState(false);

    // Referencia al input de tipo fecha.
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Combina la referencia interna con la referencia pasada.
    useImperativeHandle(
      ref,
      () => dateInputRef.current as HTMLInputElement,
      []
    );

    /**
     * Función para alternar la visibilidad de la contraseña.
     */
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    /**
     * Función para manejar el clic en el icono de fecha.
     */
    const handleDateIconClick = () => {
      if (dateInputRef.current) {
        dateInputRef.current.showPicker();
      }
    };

    // Si el componente es de tipo Password
    if (type === "password") {
      return (
        <div className={classNames(styles.Container)}>
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={classNames(styles.Input, className)}
            {...props}
          />
          <Icon
            name={showPassword ? "EyeOff" : "Eye"}
            role="button"
            onClick={togglePasswordVisibility}
            className={classNames(styles.Icon)}
          />
        </div>
      );
    }

    // Si el componente es de tipo Date
    else if (type === "date") {
      return (
        <div className={classNames(styles.Container)}>
          <input
            ref={dateInputRef}
            type="date"
            className={classNames(styles.Input, className)}
            {...props}
          />
          <Icon
            name="Calendar"
            onClick={handleDateIconClick}
            className={classNames(styles.Icon)}
          />
        </div>
      );
    } else if (type === "datetime-local") {
      return (
        <div className={classNames(styles.Container)}>
          <input
            ref={dateInputRef}
            type="datetime-local"
            className={classNames(styles.Input, className)}
            {...props}
          />
          <Icon
            name="Calendar"
            onClick={handleDateIconClick}
            className={classNames(styles.Icon)}
          />
        </div>
      );
    } else {
      return (
        <input
          ref={ref}
          className={classNames(styles.Input, className)}
          {...props}
        />
      );
    }
  }
);

Input.displayName = "Input";

export default Input;

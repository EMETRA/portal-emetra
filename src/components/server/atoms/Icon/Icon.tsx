"use client";

import React from "react";
import { IconProps } from "./types";
import styles from "./Icon.module.scss";
import classNames from "classnames";

/**
 * Componente Icon que renderiza un ícono SVG basado en el nombre proporcionado.
 *
 * @param {string} className - Clases adicionales para aplicar al ícono.
 * @param {string} name - El nombre del ícono a renderizar.
 * @param {IconProps} props - Las propiedades adicionales para el ícono.
 * @returns {JSX.Element} - El componente de ícono renderizado.
 */
const Icon: React.FC<IconProps> = ({
  className,
  name,
  width = 50,
  height = 50,
  ...props
}) => {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={`${name} icon`}
      className={classNames(className ? className : styles.icon)}
      width={width}
      height={height}
      {...(props as any)}
    />
  );
};

export default Icon;

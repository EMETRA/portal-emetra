import React from "react";
import { IconMap, IconProps } from "./types";
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
const Icon: React.FC<IconProps> = ({ className, name, ...props }) => {
  const SVGIcon = IconMap[name];
  console.log("SVGIcon", SVGIcon);
  return (
    <SVGIcon
      className={classNames(className ? className : styles.icon)}
      width={50}
      height={50}
      {...props}
    />
  );
};

export default Icon;

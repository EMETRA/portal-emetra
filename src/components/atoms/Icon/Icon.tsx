import React from "react";
import classNames from "classnames";
import styles from "./Icon.module.scss";
import { IconProps } from "./types";

/**
 * Átomo Icon: muestra un placeholder de icono.
 */
export const Icon: React.FC<IconProps> = ({ src, className, ...rest }) => (
  <span
    className={classNames(styles.icon, className)}
    style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
    {...rest}
  />
);

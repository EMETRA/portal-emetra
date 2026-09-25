import React from "react";
import { ImageProps } from "./types";
import styles from "./Image.module.scss";
import classNames from "classnames";

/**
 * Componente de imagen
 * @param {ImageProps} props - Las propiedades del elemento imagen.
 * @param {string} props.className - Clase css adicional para la imagen.
 * @returns {JSX.Element} - Elemento de la imagen.
 */

const Image: React.FC<ImageProps> = ({
    className,
    ...props
}) => {
    return (
        <img 
            className={classNames(styles.image, className)}
            {...props}
        />
    );
};

export default Image;
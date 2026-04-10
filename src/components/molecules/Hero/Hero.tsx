/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import classNames from "classnames";
import styles from "./Hero.module.scss";
import { HeroProps } from "./types";
import { Text } from "@atoms/Text";

/**
 * Hero minimalista: imagen de fondo full-width + overlay con un único texto
 * y dos “iconos” (renderizados como texto).
 */
export const Hero: React.FC<HeroProps> = ({
    backgroundImage,
    text,
    overlayImage,
    className,
    ...rest
}) => (
    <div
        className={classNames(styles.heroContainer, className)}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        {...rest}
    >
        <div className={styles.overlay} />

        <div className={styles.content}>
            <Text variant="Medium" className={styles.text}>
                {text}
            </Text>            
        
            <div className={styles.iconRow}>
                <img src={overlayImage} alt="Logos" className={styles.overlayImage}/>
            </div>
        </div>
    </div>
);
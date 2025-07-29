'use client'
import React, {useState} from "react";
import classNames from "classnames";
import styles from "./Banner.module.scss";
import { BannerProps } from './types'
import{ Hero } from "@molecules/Hero";
import { Text } from "@atoms/Text";

export const Banner: React.FC<BannerProps> = ({ slides }) => {
    const [idx, setIdx] = useState(0)

    const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)
    const next = () => setIdx(i => (i + 1) % slides.length)

    const slide = slides[idx]

    const iconsTuple: [string, string] =
        slide.icons ?? (['EMETRA', 'PMT'] as [string, string])

    return (
        <div className={styles.banner}>
            <button
                onClick={prev}
                className={classNames(styles.arrow, styles.prev)}
                aria-label="Anterior"
            >
                <Text variant={"Small"}>Anterior</Text>
            </button>

            <Hero
                backgroundImage={slide.backgroundImage}
                text={slide.text}
                icons={iconsTuple}
            />

            <button
                onClick={next}
                className={classNames(styles.arrow, styles.next)}
                aria-label="Siguiente"
            >
                <Text variant={"Small"}>Siguiente</Text>
            </button>

            <div className={styles.indicators}>
                {slides.map((_, i) => (
                <span
                    key={i}
                    className={classNames(
                    styles.dot,
                    i === idx && styles.active
                    )}
                    onClick={() => setIdx(i)}
                    aria-label={`Ir al slide ${i + 1}`}
                />
                ))}
            </div>
        </div>
    )
}
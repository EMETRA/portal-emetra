'use client'
import React, {useState} from "react";
import classNames from "classnames";
import styles from "./Banner.module.scss";
import { BannerProps } from './types'
import{ Hero } from "@molecules/Hero";
/* import { Text } from "@atoms/Text";
 */import { Icon } from "../../server/atoms/Icon";

export const Banner: React.FC<BannerProps> = ({ slides }) => {
    const [idx, setIdx] = useState(0)

    const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length)
    const next = () => setIdx(i => (i + 1) % slides.length)

/*     const slide = slides[idx]
 */

    return (
        <div className={styles.banner}>
            <button
                onClick={prev}
                className={classNames(styles.arrow, styles.prev)}
                aria-label="Anterior"
            >
                <Icon name="Up" color="white" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}/>
            </button>

            <div className={styles.slides} style={{ transform: `translateX(-${idx * 100}%)` }}>
                {slides.map((slide, i) => {
                    return (
                        <div key={i} className={styles.slide}>
                        <Hero
                            backgroundImage={slide.backgroundImage}
                            text={slide.text}
                            overlayImage={slide.overlayImage}
                        />
                        </div>
                    )
                })}
            </div>

            <button
                onClick={next}
                className={classNames(styles.arrow, styles.next)}
                aria-label="Siguiente"
            >
                <Icon name="Up" color="white" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}/>
            </button>

        </div>
    )
}
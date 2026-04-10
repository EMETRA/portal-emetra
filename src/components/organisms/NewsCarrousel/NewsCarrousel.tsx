"use client";
import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./NewsCarrousel.module.scss";
import { Icon } from "@/components/server/atoms/Icon";
import classNames from "classnames";

interface NewsCarrouselProps {
  children: React.ReactNode;
}

const NewsCarrousel: React.FC<NewsCarrouselProps> = ({ children }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerSlides, setCenterSlides] = useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Centrado de slides si no hay scroll
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const slides = Array.from(container.children) as HTMLElement[];
    const slidesWidth =
      slides.reduce((acc, slide) => acc + slide.offsetWidth, 0) +
      (slides.length - 1) * 24; // 1.5rem gap
    setCenterSlides(slidesWidth < container.offsetWidth);
  }, [children]);

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className={classNames(styles.embla)}>
      <button
        className={classNames(styles.embla__arrow, styles.left)}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Anterior"
      >
        <Icon name="Down" className={classNames(styles.Icon)} />
      </button>
      <div className={classNames(styles.embla__viewport)} ref={emblaRef}>
        <div
          className={classNames(styles.embla__container, {
            [styles.center]: centerSlides,
          })}
          ref={containerRef}
        >
          {React.Children.map(children, (child) => (
            <div className={classNames(styles.embla__slide)}>{child}</div>
          ))}
        </div>
      </div>
      <button
        className={classNames(styles.embla__arrow, styles.right)}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Siguiente"
      >
        <Icon name="Down" className={classNames(styles.Icon)} />
      </button>
    </div>
  );
};

export default NewsCarrousel;

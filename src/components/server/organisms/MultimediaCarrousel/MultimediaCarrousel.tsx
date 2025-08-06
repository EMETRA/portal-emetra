"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./MultimediaCarrousel.module.scss";

interface MultimediaCarrouselProps {
  children: React.ReactNode;
}

const MultimediaCarrousel: React.FC<MultimediaCarrouselProps> = ({
  children,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className={styles.embla}>
      <button
        className={styles.embla__arrow}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Anterior"
      >
        &#8592;
      </button>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {React.Children.map(children, (child) => (
            <div className={styles.embla__slide}>{child}</div>
          ))}
        </div>
      </div>
      <button
        className={styles.embla__arrow}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Siguiente"
      >
        &#8594;
      </button>
    </div>
  );
};

export default MultimediaCarrousel;

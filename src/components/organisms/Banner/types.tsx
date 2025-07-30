
/** Una sola diapositiva del carrusel */
export interface BannerSlide {
  backgroundImage: string;
  text: string;
  overlayImage?: string;
}

/** Props de Banner */
export interface BannerProps {
  slides: BannerSlide[];
}

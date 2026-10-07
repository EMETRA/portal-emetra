import React, { VideoHTMLAttributes } from "react";

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  /**
   * Solo YouTube: usa youtube-nocookie.com (YouTube no guarda cookies hasta
   * que se reproduce). Por defecto false.
   */
  privacyEnhanced?: boolean;
}

const isYouTubeUrl = (url: string) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);

/**
 * En YouTube, `autoPlay` inicia el video al cargar el iframe (útil cuando ya
 * se hizo clic en un botón propio de reproducir) y `title` se usa en el iframe.
 */
const getYouTubeEmbedUrl = (
  url: string,
  { autoplay = false, privacyEnhanced = false } = {}
) => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (!match) return url;
  const host = privacyEnhanced
    ? "https://www.youtube-nocookie.com"
    : "https://www.youtube.com";
  const query = autoplay ? "?autoplay=1&rel=0" : "";
  return `${host}/embed/${match[1]}${query}`;
};

function getDimensions(
  width?: number | string,
  height?: number | string
): { width: string; height: string } {
  let w = width ?? "100%";
  let h = height ?? "auto";

  if (typeof w === "number") w = `${w}px`;
  if (typeof h === "number") h = `${h}px`;

  if (h === "auto" && typeof width === "number") {
    h = `${(width * 9) / 16}px`;
  }
  if (w === "auto" && typeof height === "number") {
    w = `${(height * 16) / 9}px`;
  }

  return { width: w, height: h };
}

const Video: React.FC<VideoProps> = ({
  src,
  controls = true,
  preload = "metadata",
  width,
  height,
  style,
  privacyEnhanced = false,
  ...props
}) => {
  const { width: w, height: h } = getDimensions(width, height);

  if (isYouTubeUrl(src)) {
    return (
      <div style={{ width: w, height: h, position: "relative" }}>
        <iframe
          src={getYouTubeEmbedUrl(src, {
            autoplay: Boolean(props.autoPlay),
            privacyEnhanced,
          })}
          title={props.title ?? "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <video
      controls={controls}
      preload={preload}
      width={undefined}
      height={undefined}
      style={{ width: w, height: h, display: "block", ...style }}
      {...props}
      src={src}
    >
      Tu navegador no soporta la reproducción de video.
    </video>
  );
};

export default Video;

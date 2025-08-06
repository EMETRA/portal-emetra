import React from "react";
import Image from "next/image";
import Video from "@/components/server/atoms/Video/Video";
import classNames from "classnames";
import styles from "./MultimediaCard.module.scss";

interface MultimediaCardProps {
  src: string;
  alt?: string;
  description?: string;
  title?: string;
}

const isImageUrl = (url: string) =>
  typeof url === "string" && /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(url);

const MultimediaCard: React.FC<MultimediaCardProps> = ({
  src,
  alt = "",
  description,
  title = "Multimedia Content",
}) => {
  return (
    <div className={classNames(styles.card)}>
      <div className={classNames(styles.media)}>
        {isImageUrl(src) ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={classNames(styles.image)}
            sizes="100vw"
          />
        ) : (
          <Video
            src={src}
            width={350}
            height={"auto"}
            className={classNames(styles.video)}
          />
        )}
      </div>
      <div className={classNames(styles.content)}>
        <h4>{title}</h4>
        {description && (
          <div className={classNames(styles.description)}>
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultimediaCard;

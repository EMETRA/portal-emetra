'use client';

import React from "react";
import classNames from "classnames";
import Image from "next/image";
import styles from "./NewsCard.module.scss";
import { NewsCardProps } from "./types";
import { Heading, Text } from "@atoms/index";

export const NewsCard: React.FC<NewsCardProps> = ({
  imageSrc,
  title,
  date,
  mode,
  onClick,
  ...rest
}) => (
    <div
        className={classNames(styles.card)}
        onClick={onClick}
        {...rest}
    >
        <div className={styles.thumb}>
        <Image
            src={imageSrc}
            alt={title}
            fill
            className={styles.image}
            style={{ objectFit: "cover" }}
        />
        </div>
        <div className={styles.body}>
            <Heading variant="Small" className={styles.title}>
                {title}
            </Heading>
            <div className={styles.meta}>
                <Text variant="Small" className={styles.metaText}>
                    {date}
                </Text>
                <Text variant="Small" className={styles.metaText}>
                    {mode}
                </Text>
            </div>
        </div>
    </div>
);

import React from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import styles from "./NewCard.module.scss";

interface NewCardProps {
  id: string;
  title: string;
  date: string;
  image: string;
  className?: string;
}

const NewCard: React.FC<NewCardProps> = ({
  id,
  title,
  date,
  image,
  className,
}) => (
  <Link href={`/new/${id}`} className={classNames(styles.card, className)}>
    <div className={styles.imageWrapper}>
      <Image src={image} alt={title} fill className={styles.image} />
    </div>
    <div className={styles.content}>
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.date}>{date}</span>
    </div>
  </Link>
);

export default NewCard;

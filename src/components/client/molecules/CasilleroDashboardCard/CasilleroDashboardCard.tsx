import { Icon, IconType } from "@/components/server/atoms";
import styles from "./CasilleroDashboardCard.module.scss";

type Props = {
  title: string;
  icon: IconType;
  wide?: boolean;
  children: React.ReactNode;
};

export default function CasilleroDashboardCard({ title, icon, wide, children }: Props) {
  return (
    <article className={wide ? styles.wideCard : styles.card}>
      <header>
        <strong>{title}</strong>
        <Icon name={icon} />
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}

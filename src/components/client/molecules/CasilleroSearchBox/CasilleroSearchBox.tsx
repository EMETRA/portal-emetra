import { Icon } from "@/components/server/atoms";
import styles from "./CasilleroSearchBox.module.scss";

export default function CasilleroSearchBox() {
  return (
    <div className={styles.search}>
      <input type="search" placeholder="Buscar" />
      <Icon name="Search" />
    </div>
  );
}

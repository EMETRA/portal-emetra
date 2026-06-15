import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import styles from "./CasilleroDashboardTopbar.module.scss";

type Props = {
  userName: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
};

export default function CasilleroDashboardTopbar({ userName, sidebarOpen, onMenuClick }: Props) {
  return (
    <div className={styles.topbar}>
      <button className={styles.menuButton} type="button" onClick={onMenuClick} aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}>
        <Icon name="Menu" />
      </button>
      <div className={styles.searchSlot}>
        <CasilleroSearchBox />
      </div>
      <h1>Casillero Electrónico</h1>
      <div className={styles.actions}>
        <Icon name="Notification" />
        <Icon name="Home" />
        <Icon name="User" />
        <span>{userName}</span>
        <Icon name="Down" />
      </div>
      <button className={styles.searchButton} type="button" onClick={onMenuClick} aria-label={sidebarOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}>
        <Icon name="Search" />
      </button>
    </div>
  );
}

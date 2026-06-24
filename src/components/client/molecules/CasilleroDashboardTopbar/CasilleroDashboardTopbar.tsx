import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import styles from "./CasilleroDashboardTopbar.module.scss";
import { useRouter } from "next/navigation";

type Props = {
  userName: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
};

export default function CasilleroDashboardTopbar({ userName, sidebarOpen, onMenuClick }: Props) {
  const router = useRouter();
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
        <Icon name="Notification" onClick={() => router.push("/casillero/buzon")} aria-label="Ir a buzón"/>
        <Icon name="Home" onClick={() => router.push("/casillero/dashboard")} aria-label="Ir a inicio"/>
        <Icon name="User" onClick={() => router.push("/casillero/user-profile")} aria-label="Ir a perfil"/>
        <span>{userName}</span>
        <Icon name="Down" />
      </div>
      <button className={styles.searchButton} type="button" onClick={onMenuClick} aria-label={sidebarOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}>
        <Icon name="Search" />
      </button>
    </div>
  );
}

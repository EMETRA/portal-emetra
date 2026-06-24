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
      <button className={styles.menuButton} type="button" onClick={onMenuClick}>
        <Icon name="Menu" />
      </button>

      <div className={styles.searchSlot}>
        <CasilleroSearchBox />
      </div>

      <h1>Casillero Electrónico</h1>

      <div className={styles.actions}>
        <Icon name="Notification" onClick={() => router.push("/casillero/buzon")} />
        <Icon name="Home" onClick={() => router.push("/casillero/dashboard")} />
        <Icon name="User" onClick={() => router.push("/casillero/user-profile")} />
        <span>{userName}</span>
        <Icon name="Down" />
      </div>

      <button
        className={styles.mobileHomeButton}
        type="button"
        onClick={() => router.push("/casillero/dashboard")}
        aria-label="Ir a inicio"
      >
        <Icon name="Home" />
      </button>

      <button className={styles.searchButton} type="button" onClick={onMenuClick}>
        <Icon name="Search" />
      </button>
    </div>
  );
}
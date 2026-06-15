import Image from "next/image";
import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import styles from "./CasilleroDashboardSidebar.module.scss";

type Props = {
  open: boolean;
};

const items = ["Listado de placas", "Mis remisiones", "Historial", "Buzón"];

export default function CasilleroDashboardSidebar({ open }: Props) {
  return (
    <aside className={open ? styles.sidebar : styles.sidebarClosed}>
      <div className={styles.mobileSearch}>
        <CasilleroSearchBox />
      </div>
      <nav className={styles.nav} aria-label="Menú de Casillero">
        {items.map((item) => (
          <a href="#" key={item}>
            <span>{item}</span>
            <Icon name="Next" />
          </a>
        ))}
      </nav>
      <Image className={styles.logo} src="/images/Emetra.png" alt="EMETRA" width={193} height={80} />
    </aside>
  );
}

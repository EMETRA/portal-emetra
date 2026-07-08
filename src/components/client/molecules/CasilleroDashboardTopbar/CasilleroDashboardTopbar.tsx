"use client";

import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import styles from "./CasilleroDashboardTopbar.module.scss";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { useModeStore } from "@/store/useModeStore";

type Props = {
  userName: string;
  // sidebarOpen: boolean;
  onMenuClickAction: () => void;
};

export default function CasilleroDashboardTopbar({ userName, onMenuClickAction }: Props) {
  const router = useRouter();
  const { mode, setMode } = useModeStore();

  return (
    <div className={styles.topbar}>
      <button className={styles.menuButton} type="button" onClick={onMenuClickAction}>
        <Icon name="Menu" />
      </button>

      <div className={styles.searchSlot}>
        <CasilleroSearchBox />
      </div>

      {/* Desktop/tablet mode switcher */}
      <div className={styles.modeSwitcher}>
        <button
          type="button"
          className={classNames(styles.modeBtn, { [styles.modeBtnActive]: mode === "personal" })}
          onClick={() => setMode("personal")}
        >
          Personal
        </button>
        <button
          type="button"
          className={classNames(styles.modeBtn, { [styles.modeBtnActive]: mode === "empresa" })}
          onClick={() => setMode("empresa")}
        >
          Empresa
        </button>
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

      {/* Mobile mode switcher */}
      <div className={styles.mobileModeToggle}>
        <button
          type="button"
          className={classNames(styles.mobileModeBtn, { [styles.mobileModeBtnActive]: mode === "personal" })}
          onClick={() => setMode("personal")}
          aria-label="Modo personal"
        >
          P
        </button>
        <button
          type="button"
          className={classNames(styles.mobileModeBtn, { [styles.mobileModeBtnActive]: mode === "empresa" })}
          onClick={() => setMode("empresa")}
          aria-label="Modo empresa"
        >
          E
        </button>
      </div>

      <button className={styles.searchButton} type="button" onClick={onMenuClickAction}>
        <Icon name="Search" />
      </button>
    </div>
  );
}
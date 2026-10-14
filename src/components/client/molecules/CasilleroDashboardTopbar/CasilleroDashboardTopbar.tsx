"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import styles from "./CasilleroDashboardTopbar.module.scss";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { useModeStore } from "@/store/useModeStore";
import { useSessionStore } from "@/store/useSessionStore";
import { logout } from "@/lib/casillero/auth";

type Props = {
  userName: string;
  sidebarOpen: boolean;
  onMenuClickAction: () => void;
};

export default function CasilleroDashboardTopbar({ userName, onMenuClickAction }: Props) {
  const router = useRouter();
  const { mode, setMode } = useModeStore();
  const { sessionToken, clearSession } = useSessionStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleModeChange = (newMode: "personal" | "empresa") => {
    setMode(newMode);
    router.push("/casillero/dashboard");
  };

  const handleLogout = async () => {
    if (sessionToken) {
      await logout(sessionToken);
    }
    clearSession();
    router.push("/casillero");
  };

  // cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.topbar}>
      <button className={styles.menuButton} type="button" onClick={onMenuClickAction}>
        <Icon name="Menu" />
      </button>

      <div className={styles.searchSlot}>
        <CasilleroSearchBox />
      </div>

      <div className={styles.modeSwitcher}>
        <button
          type="button"
          className={classNames(styles.modeBtn, { [styles.modeBtnActive]: mode === "personal" })}
          onClick={() => handleModeChange("personal")}
        >
          Personal
        </button>
        <button
          type="button"
          className={classNames(styles.modeBtn, { [styles.modeBtnActive]: mode === "empresa" })}
          onClick={() => handleModeChange("empresa")}
        >
          Empresa
        </button>
      </div>

      <h1>Casillero Electrónico</h1>

      <div className={styles.actions}>
        <Icon name="Notification" onClick={() => router.push("/casillero/buzon")} />
        <Icon name="Home" onClick={() => router.push("/casillero/dashboard")} />
        <Icon name="User" onClick={() => router.push("/casillero/user-profile")} />

        {/* Dropdown de usuario */}
        <div className={styles.userMenu} ref={dropdownRef}>
          <button
            type="button"
            className={styles.userMenuTrigger}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-label="Menú de usuario"
          >
            <span>{userName}</span>
            <Icon
              name="Down"
              className={classNames(styles.chevron, { [styles.chevronOpen]: dropdownOpen })}
            />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              {/* <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/casillero/user-profile");
                }}
              >
                <Icon name="User" />
                Mi perfil
              </button> */}
              {/* <div className={styles.dropdownDivider} /> */}
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={handleLogout}
              >
                <Icon name="Logout" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        className={styles.mobileHomeButton}
        type="button"
        onClick={() => router.push("/casillero/dashboard")}
        aria-label="Ir a inicio"
      >
        <Icon name="Home" />
      </button>

      <div className={styles.mobileModeToggle}>
        <button
          type="button"
          className={classNames(styles.mobileModeBtn, { [styles.mobileModeBtnActive]: mode === "personal" })}
          onClick={() => handleModeChange("personal")}
          aria-label="Modo personal"
        >
          P
        </button>
        <button
          type="button"
          className={classNames(styles.mobileModeBtn, { [styles.mobileModeBtnActive]: mode === "empresa" })}
          onClick={() => handleModeChange("empresa")}
          aria-label="Modo empresa"
        >
          E
        </button>
      </div>
      {/* Mobile notifications */}
      <button
        type="button"
        className={styles.mobileNotificationButton}
        onClick={() => router.push("/casillero/buzon")}
        aria-label="Ir a buzón"
      >
        <Icon name="Notification" />
      </button>

      {/* Mobile user profile */}
      <button
        type="button"
        className={styles.mobileUserButton}
        onClick={() => router.push("/casillero/user-profile")}
        aria-label="Ir a perfil"
      >
        <Icon name="User" />
      </button>
      <button
        type="button"
        className={styles.mobileLogoutButton}
        onClick={handleLogout}
        aria-label="Cerrar sesión"
      >
        <Icon name="Logout" />
      </button>
      <button className={styles.searchButton} type="button" onClick={onMenuClickAction}>
        <Icon name="Search" />
      </button>
    </div>
  );
}
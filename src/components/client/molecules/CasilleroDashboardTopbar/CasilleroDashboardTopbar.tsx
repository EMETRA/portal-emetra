"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import styles from "./CasilleroDashboardTopbar.module.scss";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { useSessionStore } from "@/store/useSessionStore";
import { logout } from "@/lib/casillero/auth";
import { deactivateCompanyContext, getActiveCompanyContext, getCompanies } from "@/lib/casillero/company";

type Props = {
  userName: string;
  sidebarOpen: boolean;
  onMenuClickAction: () => void;
};

export default function CasilleroDashboardTopbar({ userName, onMenuClickAction }: Props) {
  const router = useRouter();
  const { clearSession } = useSessionStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [activeCompanyName, setActiveCompanyName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContext = async () => {
      const companyId = await getActiveCompanyContext();
      if (!companyId) return setActiveCompanyName(null);
      const companies = await getCompanies().catch(() => []);
      const company = companies.find((item) => item.companyId === companyId);
      setActiveCompanyName(company?.commercialName || company?.legalName || "Empresa");
    };
    void loadContext();
    window.addEventListener("company-context-changed", loadContext);
    return () => window.removeEventListener("company-context-changed", loadContext);
  }, []);

  const usePersonalContext = async () => {
    await deactivateCompanyContext();
    setDropdownOpen(false);
    router.push("/casillero/dashboard");
    router.refresh();
  };

  const handleLogout = async () => {
    if (cerrandoSesion) return;
    setCerrandoSesion(true);
    setDropdownOpen(false);
    // El BFF borra la cookie aunque la sesión ya esté vencida; aquí se limpia lo local.
    await logout();
    clearSession();
    // replace + refresh: "Atrás" no regresa al dashboard guardado en la caché del router.
    router.replace("/casillero");
    router.refresh();
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

      <h1>Casillero Electrónico{activeCompanyName ? <small>{activeCompanyName}</small> : null}</h1>

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
              {activeCompanyName ? <button type="button" className={styles.dropdownItem} onClick={() => void usePersonalContext()}>Usar contexto personal</button> : null}
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
                disabled={cerrandoSesion}
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
        disabled={cerrandoSesion}
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

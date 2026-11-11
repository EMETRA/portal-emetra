"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import classNames from "classnames";
import { Icon } from "@/components/server/atoms";
import CasilleroSearchBox from "@/components/client/molecules/CasilleroSearchBox/CasilleroSearchBox";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useModeStore } from "@/store/useModeStore";
import { companyMenuItems, useCompanyAccess } from "@/lib/casillero/company";
import styles from "./CasilleroDashboardSidebar.module.scss";

type Props = {
    open: boolean;
    onClose: () => void;
};

const PERSONAL_ITEMS = [
    { label: "Listado de placas", href: "/casillero/dashboard/placas" },
    { label: "Mis remisiones", href: "/casillero/dashboard/multas" },
    { label: "Historial", href: "/casillero/dashboard/historial" },
    { label: "Buzón", href: "/casillero/buzon" },
    { label: "Mis solicitudes", href: "/casillero/dashboard/solicitudes" },
];

export default function CasilleroDashboardSidebar({ open, onClose }: Props) {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 520px)");
    const { mode } = useModeStore();
    const { status, access, errorMessage, load } = useCompanyAccess();

    const items = mode === "empresa" ? companyMenuItems(access) : PERSONAL_ITEMS;

    useEffect(() => {
        if (isMobile && open) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <aside className={open ? styles.sidebar : styles.sidebarClosed}>
            <div className={styles.mobileSearch}>
                <CasilleroSearchBox />
            </div>

            <nav className={styles.nav} aria-label="Menú de Casillero">
                {mode === "empresa" && (status === "idle" || status === "loading") ? (
                    <p className={styles.menuMessage} role="status">Cargando menú...</p>
                ) : mode === "empresa" && status === "error" ? (
                    <div className={styles.menuMessage}>
                        <p role="alert">{errorMessage}</p>
                        <button type="button" onClick={() => void load()}>Reintentar</button>
                    </div>
                ) : items.map(({ label, href }) => {
                    const isActive = href === "/casillero/empresa"
                        ? pathname === href
                        : pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <Link href={href} key={label} className={classNames({ [styles.active]: isActive })}>
                            <span>{label}</span>
                            <Icon name="Next" />
                        </Link>
                    );
                })}
            </nav>

            <Image className={styles.logo} src="/images/Emetra.png" alt="EMETRA" width={193} height={80} />
        </aside>
    );
}
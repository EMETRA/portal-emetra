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
];

const COMPANY_ITEMS = [
    { label: "Listado de placas", href: "/casillero/dashboard/placas" },
    { label: "Mis remisiones", href: "/casillero/dashboard/multas" },
    { label: "Historial", href: "/casillero/dashboard/historial" },
    { label: "Buzón", href: "/casillero/buzon" },
    { label: "Gestión de empleados", href: "/casillero/employee-management" },
];

export default function CasilleroDashboardSidebar({ open, onClose }: Props) {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 520px)");
    const { mode } = useModeStore();

    const items = mode === "empresa" ? COMPANY_ITEMS : PERSONAL_ITEMS;

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
                {items.map(({ label, href }) => {
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);
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
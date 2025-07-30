"use client";
import Image from "next/image";
import { Button, Icon, IconType } from "../../atoms";
import classNames from "classnames";
import styles from "./NavBar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems: { name: string; icon: IconType; href: string }[] = [
  { name: "INICIO", icon: "DPI", href: "/" },
  { name: "REMISIONES", icon: "Multa", href: "/remisiones" },
  { name: "SERVICIOS", icon: "Files", href: "/servicios" },
  { name: "VIDEOS", icon: "DPI", href: "/videos" },
  { name: "FAQ", icon: "Info", href: "/ayuda" },
];

const NavBar: React.FC = () => {
  const currentPath = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={classNames(styles.Container)}>
      <div className={classNames(styles.ImageContainer)}>
        <Image
          src="/images/Emetra.png"
          alt="Logo"
          width={193}
          height={80}
          style={{ height: "100%", width: "auto" }}
        />
      </div>
      <button
        className={styles.Hamburger}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Abrir menú"
      >
        {/* Usa tu icono de hamburguesa aquí */}
        <Icon name="Menu" />
      </button>
      <div
        className={classNames(
          styles.ButtonsContainer,
          menuOpen && styles.MenuOpen
        )}
      >
        {navItems.map((item) => (
          <Link href={item.href} key={item.name} className={styles.NavLink}>
            <Button
              className={classNames(
                styles.Button,
                currentPath === item.href && styles.ActiveButton
              )}
            >
              <Icon name={item.icon} />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;

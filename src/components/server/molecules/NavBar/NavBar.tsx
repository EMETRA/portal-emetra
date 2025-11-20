"use client";
import Image from "next/image";
import { Button, Icon, IconType } from "../../atoms";
import classNames from "classnames";
import styles from "./NavBar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navItems: { name: string; icon: IconType; href: string }[] = [
  { name: "INICIO", icon: "DPI", href: "/" },
  { name: "REMISIONES", icon: "Multa", href: "https://especiales.muniguate.com/remisiones.htm" },
  { name: "SERVICIOS5", icon: "Files", href: "/#servicios" },
  { name: "VIDEOS", icon: "DPI", href: "/videos" },
  { name: "FAQ", icon: "Info", href: "/#ayuda" },
  { name: "SÚMATE", icon: "User", href: "/sumate" },
];

const normalize = (path: string) => path.replace(/\/$/, "");

function findSnapContainer(): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>("div,main,section"));
  for (const el of all) {
    const v = getComputedStyle(el).getPropertyValue('scroll-snap-type');
    if (v && v.includes("y")) return el;
  }
  return null;
}

function scrollToIndex(index: number) {
  const container = findSnapContainer();
  if (!container) return;

  const pages = Array.from(container.querySelectorAll<HTMLElement>(':scope > section'));
  const target = pages[index];
  if(!target) return;
  container.scrollTo({top: target.offsetTop, behavior: 'smooth'});
}

const sumateItems: { label: string; index: number }[] = [
  { label: "INICIO", index: 0 },
  { label: "ANTECEDENTES", index: 1 },
  { label: "PROYECTO SÚMATE", index: 3 },
  { label: "CÓMO SUMARTE", index: 5 },
  { label: "INSTITUCIONES", index: 4 },
  { label: "UNIVERSIDADES", index: 6 },  
  { label: "CONTACTO", index: 7 },
];


const NavBar: React.FC = () => {
  const currentPath = usePathname() || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [sumateOpen, setSumateOpen] = useState(false);
  const sumateRef = useRef<HTMLDivElement>(null);

  const isSumate = currentPath.startsWith("/sumate");
  const itemsForRender = isSumate
    ? navItems
    : navItems.filter((i) => i.name !== "SÚMATE");

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!sumateRef.current) return;
      if (!sumateRef.current.contains(e.target as Node)) setSumateOpen(false);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSumateOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    }
  },[]);

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
        onClick={() => setMenuOpen((open) => {
          const next = !open;
          if (!next) setSumateOpen(false);
          return next;
        })}
        aria-label="Abrir menú"
      >
        <Icon name="Menu" />
      </button>
      <div
        className={classNames(
          styles.ButtonsContainer,
          menuOpen && styles.MenuOpen
        )}
      >
        {itemsForRender.map((item) => {
          const isActive =
            currentPath && normalize(currentPath) === normalize(item.href);
          
          if (isSumate && item.name === "SÚMATE") {
            return (
              <div key={item.name} ref={sumateRef} className={classNames(styles.Dropdown, sumateOpen && styles.DropdownOpen)}>
                <Button className={classNames(styles.Button, styles.ActiveButton, styles.DropdownToggle)}
                  onClick={() => setSumateOpen((open) => !open)}
                  aria-expanded={sumateOpen}
                  aria-haspopup="menu"
                >
                  <Icon name={item.icon} />
                    {item.name}
                  <Icon name={sumateOpen ? "Up" : "Down"} />
                </Button>

                <div className={styles.DropdownMenu} role="menu">
                  {sumateItems.map((it) =>(
                    <button key={it.label} className={styles.DropdownItem} role="menuitem"
                      onClick={() => {
                        scrollToIndex(it.index);
                        setSumateOpen(false);
                        setMenuOpen(false);
                      }}>
                        {it.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <Link href={item.href} key={item.name} className={styles.NavLink}>
              <Button
                className={classNames(
                  styles.Button,
                  isActive && styles.ActiveButton
                )}
              >
                <Icon name={item.icon} />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;

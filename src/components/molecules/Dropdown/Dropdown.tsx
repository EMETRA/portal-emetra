"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";
import classNames from "classnames";
import { Heading, Icon } from "@atoms/index";
import { DropdownProps } from "./types";

/**
 * Componente Dropdown, es capaz de hacer dropdown de cualquier cosa.
 * @param {string} [className] - Clase(s) adicional(es) para el dropdown.
 * @param {string} question - Pregunta que se mostrará en el dropdown.
 * @param {React.ReactNode} children - Contenido del dropdown o respuesta a la pregunta.
 * @returns {JSX.Element} El componente Dropdown renderizado.
 */
const Dropdown: React.FC<DropdownProps> = ({
  children,
  question,
  className,
}) => {
  // Estado para gestionar si el dropdown está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  // Referencia para acceder al elemento DOM del contenido del dropdown
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Alterna el estado abierto/cerrado del dropdown.
   */
  const openDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  /**
   * Actualiza la altura del contenido del dropdown basado en su scrollHeight.
   */
  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.height = "0px";
      }
    }
  }, [isOpen]);

  // Efecto para actualizar la altura cuando cambia el estado abierto/cerrado
  useEffect(() => {
    updateHeight();
  }, [isOpen, updateHeight]);

  // Efecto para manejar el redimensionamiento de la ventana y observar cambios en el tamaño del contenido
  useEffect(() => {
    const handleResize = () => {
      updateHeight();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const currentContentRef = contentRef.current;

    if (currentContentRef) {
      resizeObserver.observe(currentContentRef);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentContentRef) {
        resizeObserver.unobserve(currentContentRef);
      }
    };
  }, [updateHeight]);

  return (
    <div
      className={classNames(
        styles.Container,
        {
          [styles.Open]: isOpen,
          [styles.Close]: !isOpen,
        },
        className
      )}
    >
      <div
        className={classNames(styles.Header)}
        role="button"
        onClick={openDropdown}
      >
        <Heading className={classNames(styles.Label)} variant="Extra-Small">
          {question}
        </Heading>
        
      </div>
      <div
        ref={contentRef}
        className={classNames(styles.Children, {
          [styles.Open]: isOpen,
          [styles.Close]: !isOpen,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;

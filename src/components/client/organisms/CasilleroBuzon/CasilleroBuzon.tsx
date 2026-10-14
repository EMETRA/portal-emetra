"use client";

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeaderCell,
} from '@/components/atoms/Table/'
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Icon } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { Text } from "@/components/atoms/Text";
import { Switch } from "@/components/client/atoms/Switch";
import PaginationArrows from "@/components/client/atoms/PaginationArrows/PaginationArrows";
import { CasilleroNotification } from '@/components/client/molecules/CasilleroNotificationModal';
import { CasilleroPopUp } from "@/components/client/molecules/CasilleroPopUp";
import { fetchNotifications, isSesionVencida } from "@/lib/casillero/notifications";
import type { CasilleroNotificationList } from "@/lib/casillero/types";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "./CasilleroBuzon.module.scss";

const cellphoneMuck = "1234-5678"

const NOTIFICACIONES_POR_PAGINA = 20;
const COLUMNAS = 3;

const formatearFecha = (iso: string) => {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime())
    ? ""
    : fecha.toLocaleDateString("es-GT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatearHora = (iso: string) => {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime())
    ? ""
    : fecha.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
};

export default function CasilleroBuzon() {
  const router = useRouter();
  const clearSession = useSessionStore((state) => state.clearSession);

  // Paginación por cursor (sin total): se guarda el cursor de cada página visitada para
  // poder volver atrás. La primera página no lleva cursor.
  const [cursores, setCursores] = useState<(string | null)[]>([null]);
  const [pagina, setPagina] = useState(0);
  const [listado, setListado] = useState<CasilleroNotificationList | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  const cursorActual = cursores[pagina];

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError("");

    fetchNotifications(NOTIFICACIONES_POR_PAGINA, cursorActual)
      .then((respuesta) => {
        if (!cancelado) setListado(respuesta);
      })
      .catch((err) => {
        if (cancelado) return;
        if (isSesionVencida(err)) {
          clearSession();
          router.replace("/casillero");
          return;
        }
        setError(err instanceof Error ? err.message : "No se pudo cargar el buzón. Intenta más tarde");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [cursorActual, intento, clearSession, router]);

  const paginaSiguiente = () => {
    const siguiente = listado?.nextCursor;
    if (cargando || !siguiente) return;
    setCursores((anteriores) => [...anteriores.slice(0, pagina + 1), siguiente]);
    setPagina((actual) => actual + 1);
  };

  const paginaAnterior = () => {
    if (cargando || pagina === 0) return;
    setPagina((actual) => actual - 1);
  };

  const hayMasPaginas = Boolean(listado?.nextCursor);
  const mostrarPaginacion = !error && (pagina > 0 || hayMasPaginas);

  const [whatsappSuscription, setWhatsappSuscription] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<string | undefined>(undefined);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [whatsAppModalTitle, setWhatsAppModalTitle] = useState("");
  const [whatsAppModalDescription, setWhatsAppModalDescription] = useState("");

  const handleDownload = (id: string) => {
    alert(`Descargando notificación ${id}`);
  }

  const handleSuscriptionToggle = (checked: boolean) => {
    if (checked) {
      setWhatsAppModalTitle("Recibir notificaciones a mi WhatsApp")
      setWhatsAppModalDescription(`¿Estás seguro de recibir las notificaciones a tu número ${cellphoneMuck}?
                    \nPodrás desuscribirte en cualquier momento.
                    \nNo se realizará ningún cobro por este servicio de mensajería.`)
    } else {
      setWhatsAppModalTitle("Dejar de recibir notificaciones a mi WhatsApp")
      setWhatsAppModalDescription(`¿Estás seguro de CANCELAR las notificaciones a tu número ${cellphoneMuck}?
                    \nPodrás suscribirte de nuevo en cualquier momento.`)
    }

    setIsPopUpOpen(true);
  }

  return (
    <div className={styles.wrapper}>
      <SectionTitle>Notificaciones</SectionTitle>

      <div className={styles.layout}>
        <CardGeneral className={styles.whatsAppCard} padding="md">
          <div className={styles.suscriptionInfo}>
            <Icon name='Whatsapp' className={styles.icon} />
            <div className={styles.suscriptionDescription}>
              <Text variant='Medium' className={styles.suscriptionText}><strong>Notificaciones por WhatsApp</strong></Text>
              <Text variant='Medium' className={styles.suscriptionText}>Recibe tus notificaciones directamente en tu WhatsApp</Text>
            </div>
          </div>
          <Switch
            checked={whatsappSuscription}
            label={whatsappSuscription ? "Desuscribir" : "Suscribir"}
            onChange={(e) => {
              handleSuscriptionToggle(e.target.checked)
            }}
          />
        </CardGeneral>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Buzón</TableHeaderCell>
              <TableHeaderCell />
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={COLUMNAS}>
                  <LoadingSpinner variant="inline" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={COLUMNAS}>
                  <div className={styles.estado}>
                    <Text variant="Medium">{error}</Text>
                    <Button variant="success" onClick={() => setIntento((actual) => actual + 1)}>
                      Reintentar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : !listado?.items.length ? (
              <TableRow>
                <TableCell colSpan={COLUMNAS}>
                  <div className={styles.estado}>
                    <Text variant="Medium">No tienes notificaciones en tu buzón.</Text>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              listado.items.map((notification) => (
                <TableRow key={notification.id} onClick={() => setSelectedNotification(notification.id)} className={styles.row}>
                  <TableCell>{formatearFecha(notification.issuedAt)}</TableCell>
                  <TableCell>{notification.subject}</TableCell>
                  <TableCell>{formatearHora(notification.issuedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {mostrarPaginacion && (
          <PaginationArrows
            page={pagina}
            totalPages={hayMasPaginas ? pagina + 2 : pagina + 1}
            onPrev={paginaAnterior}
            onNext={paginaSiguiente}
            label={`Página ${pagina + 1}`}
          />
        )}
      </div>
      <CasilleroNotification
        isOpen={!!selectedNotification}
        id={selectedNotification ?? ''}
        onClose={() => setSelectedNotification(undefined)}
        onDownload={handleDownload}
      />
      <CasilleroPopUp
        isOpen={isPopUpOpen}
        title={whatsAppModalTitle}
        description={whatsAppModalDescription}
        actions={
          [
            {
              text: "Sí, estoy seguro",
              variant: "success",
              onClick: () => {
                setWhatsappSuscription(!whatsappSuscription)
                setIsPopUpOpen(false)
              }
          },{
              text: "No, en otra ocasión",
              variant: "danger",
              onClick: () => setIsPopUpOpen(false)
          }
          ]
        }
        onClose={() => setIsPopUpOpen(false)}
      />
    </div>
  );
}

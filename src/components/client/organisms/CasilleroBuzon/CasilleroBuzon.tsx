"use client";

import React, { useCallback, useEffect, useState } from 'react'
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
import {
  fetchNotifications,
  asuntoNotificacion,
  formatearFechaNotificacion,
  formatearHoraNotificacion,
  isNewNotification,
  isSesionVencida,
} from "@/lib/casillero/notifications";
import { fetchMyContacts } from "@/lib/casillero/api";
import type { CasilleroContact, CasilleroNotificationList } from "@/lib/casillero/types";
import {
  changeWhatsAppSubscription,
  createWhatsAppSubscription,
  fetchWhatsAppSubscriptions,
  WhatsAppSubscriptionError,
  type WhatsAppSubscription,
} from "@/lib/casillero/whatsappSubscriptions";
import { useCasilleroProfileStore } from "@/store/useCasilleroProfileStore";
import { useSessionStore } from "@/store/useSessionStore";
import styles from "./CasilleroBuzon.module.scss";

const NOTIFICACIONES_POR_PAGINA = 20;
const COLUMNAS = 3;

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

  // 401 del backend: la sesión venció o fue revocada; se limpia y se vuelve al login.
  const irAlLoginPorSesionVencida = useCallback(() => {
    clearSession();
    router.replace("/casillero");
  }, [clearSession, router]);

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
          irAlLoginPorSesionVencida();
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
  }, [cursorActual, intento, irAlLoginPorSesionVencida]);

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
  const [whatsappSubscription, setWhatsappSubscription] = useState<WhatsAppSubscription | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState<CasilleroContact | null>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(true);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
  const [desiredWhatsappState, setDesiredWhatsappState] = useState<boolean | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | undefined>(undefined);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [whatsAppModalTitle, setWhatsAppModalTitle] = useState("");
  const [whatsAppModalDescription, setWhatsAppModalDescription] = useState("");

  useEffect(() => {
    let cancelled = false;
    setWhatsappLoading(true);
    Promise.all([
      useCasilleroProfileStore.getState().load(),
      fetchMyContacts(),
      fetchWhatsAppSubscriptions(),
    ])
      .then(([profile, contacts, subscriptions]) => {
        if (cancelled) return;
        if (profile.currentContext.type !== "PERSONAL") {
          setWhatsappError("La suscripción de WhatsApp está disponible únicamente en el contexto personal.");
          return;
        }
        const phones = (contacts.items ?? []).filter(
          (contact) => contact.type === "PHONE" && contact.status === "ACTIVE" && contact.verified
        );
        const phone = phones.find((contact) => contact.primary) ?? phones[0] ?? null;
        const current = subscriptions.find((subscription) =>
          ["PENDING", "ACTIVE", "PAUSED"].includes(subscription.status)
        ) ?? null;
        setWhatsappPhone(phone);
        setWhatsappSubscription(current);
        setWhatsappSuscription(current?.status === "PENDING" || current?.status === "ACTIVE");
        setWhatsappError(phone ? "" : "Necesitas un teléfono activo y verificado para activar WhatsApp.");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof WhatsAppSubscriptionError && err.status === 401) {
          irAlLoginPorSesionVencida();
          return;
        }
        setWhatsappError(err instanceof Error ? err.message : "No se pudo consultar la suscripción de WhatsApp.");
      })
      .finally(() => {
        if (!cancelled) setWhatsappLoading(false);
      });
    return () => { cancelled = true; };
  }, [irAlLoginPorSesionVencida]);


  const handleSuscriptionToggle = (checked: boolean) => {
    if (whatsappLoading || whatsappSaving || (!whatsappPhone && checked)) return;
    setDesiredWhatsappState(checked);
    if (checked) {
      setWhatsAppModalTitle("Recibir notificaciones a mi WhatsApp")
      setWhatsAppModalDescription(`¿Estás seguro de recibir las notificaciones a tu número ${whatsappPhone?.value ?? "verificado"}?
                    \nPodrás desuscribirte en cualquier momento.
                    \nNo se realizará ningún cobro por este servicio de mensajería.`)
    } else {
      setWhatsAppModalTitle("Dejar de recibir notificaciones a mi WhatsApp")
      setWhatsAppModalDescription(`¿Estás seguro de CANCELAR las notificaciones a tu número ${whatsappPhone?.value ?? "verificado"}?
                    \nPodrás suscribirte de nuevo en cualquier momento.`)
    }

    setIsPopUpOpen(true);
  }

  const confirmWhatsappChange = async () => {
    if (desiredWhatsappState === null || whatsappSaving) return;
    setWhatsappSaving(true);
    setWhatsappError("");
    try {
      const updated = desiredWhatsappState
        ? whatsappSubscription?.status === "PAUSED"
          ? await changeWhatsAppSubscription(whatsappSubscription, "RESUME")
          : await createWhatsAppSubscription(whatsappPhone!.contactId)
        : await changeWhatsAppSubscription(whatsappSubscription!, "UNSUBSCRIBE");
      setWhatsappSubscription(updated.status === "UNSUBSCRIBED" ? null : updated);
      setWhatsappSuscription(updated.status === "PENDING" || updated.status === "ACTIVE");
      setIsPopUpOpen(false);
      setDesiredWhatsappState(null);
    } catch (err) {
      if (err instanceof WhatsAppSubscriptionError && err.status === 401) {
        irAlLoginPorSesionVencida();
        return;
      }
      setWhatsappError(err instanceof Error ? err.message : "No se pudo actualizar la suscripción de WhatsApp.");
      setIsPopUpOpen(false);
    } finally {
      setWhatsappSaving(false);
    }
  };

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
            label={whatsappLoading ? "Cargando..." : whatsappSuscription ? "Desuscribir" : "Suscribir"}
            state={whatsappLoading || whatsappSaving || (!whatsappPhone && !whatsappSuscription) ? "disabled" : "default"}
            onChange={(e) => {
              handleSuscriptionToggle(e.target.checked)
            }}
          />
          {whatsappError && <Text variant="Small">{whatsappError}</Text>}
        </CardGeneral>
        <div className={styles.listado}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell colSpan={COLUMNAS}>Buzón</TableHeaderCell>
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
                  <TableCell>{formatearFechaNotificacion(notification.issuedAt)}</TableCell>
                  <TableCell>
                    <span className={styles.asuntoWrapper}>
                      <span
                        className={`${styles.readIndicator} ${
                          isNewNotification(notification.status)
                            ? styles.unreadIndicator
                            : styles.readIndicatorDone
                        }`}
                        title={isNewNotification(notification.status) ? "Notificación nueva" : "Notificación leída"}
                        aria-label={isNewNotification(notification.status) ? "Notificación nueva" : "Notificación leída"}
                      />
                      <span className={styles.asunto}>{asuntoNotificacion(notification)}</span>
                    </span>
                    {/* En móvil la fecha y la hora van bajo el asunto (una sola columna). */}
                    <span className={styles.fechaMovil}>
                      {formatearFechaNotificacion(notification.issuedAt)} • {formatearHoraNotificacion(notification.issuedAt)}
                    </span>
                  </TableCell>
                  <TableCell>{formatearHoraNotificacion(notification.issuedAt)}</TableCell>
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
      </div>
      <CasilleroNotification
        isOpen={!!selectedNotification}
        id={selectedNotification ?? ''}
        onClose={() => setSelectedNotification(undefined)}
        onSesionVencida={irAlLoginPorSesionVencida}
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
              onClick: () => { void confirmWhatsappChange(); }
          },{
              text: "No, en otra ocasión",
              variant: "danger",
              onClick: () => setIsPopUpOpen(false)
          }
          ]
        }
        onClose={() => {
          if (whatsappSaving) return;
          setDesiredWhatsappState(null);
          setIsPopUpOpen(false);
        }}
      />
    </div>
  );
}

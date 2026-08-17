"use client";

import React, { useState } from 'react'
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
import { Icon } from "@/components/server/atoms";
import { Text } from "@/components/atoms/Text";
import { Switch } from "@/components/client/atoms/Switch";
import { CasilleroNotification } from '@/components/client/molecules/CasilleroNotificationModal';
import { CasilleroPopUp } from "@/components/client/molecules/CasilleroPopUp";
import styles from "./CasilleroBuzon.module.scss";

const cellphoneMuck = "1234-5678"

export default function CasilleroBuzon() {
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

  const DUMMY_DATA = [
    {
      id: '1',
      title: 'Notificación 1',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
    {
      id: '2',
      title: 'Notificación 2',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
    {
      id: '3',
      title: 'Notificación 3',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
    {
      id: '4',
      title: 'Notificación 4',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
    {
      id: '5',
      title: 'Notificación 5',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
    {
      id: '6',
      title: 'Notificación 6',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
    {
      id: '7',
      title: 'Notificación 7',
      date: '2026-06-22',
      time: '10:00',
      onClose: () => setSelectedNotification(undefined),
      onDownload: handleDownload,
    },
  ]

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
            {DUMMY_DATA.map((notification) => (
              <TableRow key={notification.id} onClick={() => setSelectedNotification(notification.id)} className={styles.row}>
                <TableCell>{notification.date}</TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

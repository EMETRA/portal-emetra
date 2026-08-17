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
import { CasilleroNotification } from '@/components/client/molecules/CasilleroNotificationModal';
import styles from "./CasilleroBuzon.module.scss";

export default function CasilleroBuzon() {
  const [selectedNotification, setSelectedNotification] = useState<string | undefined>(undefined);

  const handleDownload = (id: string) => {
    alert(`Descargando notificación ${id}`);
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
    </div>
  );
}

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
import SatTitle from "@/components/atoms/SatTitle/SatTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import Text from "@/components/atoms/Text/Text";
import { Button, Input } from "@/components/server/atoms";
import { IconButton } from "@/components/atoms/IconButton";
import { Trash } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { newEmployeeSchema } from "./newEmployee.schema";
import styles from "./CasilleroEmployeeManagement.module.scss";

export default function CasilleroEmployeeManagement() {
  const [nit, setNit] = useState("");
  const [dpi, setDpi] = useState("");

  const isMobile = useMediaQuery("(max-width: 426px)");

  const handleDelete = (id: string) => {
    alert(`Eliminar empleado ${id}`);
  }

  const handleNewEmployee = async () => {
    try {
      await newEmployeeSchema.validate({ nit, dpi });
      alert(`Nuevo empleado ${nit} ${dpi}`);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  const DUMMY_DATA = [
    {
      id: '1',
      nit: '12345678',
      dpi: '1234567890101',
      name: 'Daniel Esteban Morales Urizar  ',
    },
    {
      id: '2',
      nit: '12345679',
      dpi: '1234567890102',
      name: 'Juan Perez Garcia',
    },
    {
      id: '3',
      nit: '12345680',
      dpi: '1234567890103',
      name: 'Maria Lopez Gomez',
    },
    {
      id: '4',
      nit: '12345681',
      dpi: '1234567890104',
      name: 'Pedro Ramirez Sanchez',
    },
    {
      id: '5',
      nit: '12345682',
      dpi: '1234567890105',
      name: 'Ana Garcia Lopez',
    },
    {
      id: '6',
      nit: '12345683',
      dpi: '1234567890106',
      name: 'Luis Hernandez Gomez',
    },
    {
      id: '7',
      nit: '12345684',
      dpi: '1234567890107',
      name: 'Jose Rodriguez Lopez',
    },
    {
      id: '8',
      nit: '12345685',
      dpi: '1234567890108',
      name: 'Ana Garcia Lopez',
    },
    {
      id: '9',
      nit: '12345686',
      dpi: '1234567890109',
      name: 'Pedro Ramirez Sanchez',
    },
    {
      id: '10',
      nit: '12345687',
      dpi: '1234567890110',
      name: 'Ana Garcia Lopez',
    },
  ]

  const renderEmployeeInfo = (key: string, value: string) => {
    return (
      <div className={styles.employeeItemInfo}>
        <Text className={styles.employeeItemInfoTitle}><strong>{key}</strong></Text>
        <Text className={styles.employeeItemInfoValue}>{value}</Text>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <SatTitle uppercase={false}>Gestión de empleados</SatTitle>

      <div className={styles.layout}>
        <CardGeneral className={styles.newEmployeeCard} padding="lg">
          <label className={styles.field} htmlFor="nit">
            <span className={styles.label}>NIT</span>
            <Input
              className={styles.input}
              id="nit"
              type="text"
              value={nit}
              placeholder="Ingresa el NIT (Ej. 1265786)"
              onChange={(event) => setNit(event.target.value)}
              required
            />
          </label>
          <label className={styles.field} htmlFor="dpi">
            <span className={styles.label}>DPI</span>
            <Input
              className={styles.input}
              id="dpi"
              type="text"
              value={dpi}
              placeholder="Ingresa el DPI (Ej. 5684658530101)"
              onChange={(event) => setDpi(event.target.value)}
              required
            />
          </label>
          <Button type="button" variant="success" className={styles.newEmployeeButton} onClick={handleNewEmployee}>
            Agregar
          </Button>
        </CardGeneral>
        <CardGeneral className={styles.employeesCard} padding="lg">
          <h2 className={styles.title}>Empleados</h2>
          {isMobile ? (
            <div className={styles.employeesList}>
              {DUMMY_DATA.map((employee) => (
                <div key={employee.id} className={styles.employeeItem}>
                  <div className={styles.employeeItemHeader}>
                    {renderEmployeeInfo("NIT", employee.nit)}
                    <IconButton icon={Trash} onClick={() => handleDelete(employee.id)} label="Eliminar" />
                  </div>
                  {renderEmployeeInfo("DPI", employee.dpi)}
                  {renderEmployeeInfo("Nombre", employee.name)}
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow className={styles.headerRow}>
                  <TableHeaderCell>NIT</TableHeaderCell>
                  <TableHeaderCell>DPI</TableHeaderCell>
                  <TableHeaderCell>Nombre</TableHeaderCell>
                  <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DUMMY_DATA.map((employee) => (
                  <TableRow key={employee.id} className={styles.row}>
                    <TableCell>{employee.nit}</TableCell>
                    <TableCell>{employee.dpi}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>
                      <IconButton icon={Trash} onClick={() => handleDelete(employee.id)} label="Eliminar" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardGeneral>
      </div>
    </div>
  );
}

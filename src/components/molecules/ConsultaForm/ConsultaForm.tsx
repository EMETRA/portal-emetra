'use client'

import React, {useState, useMemo} from 'react'
import {Input, Button, StatusBadge} from '../../server/atoms/index'
import Select from '../../atoms/Select/Select'
import styles from './ConsultaForm.module.scss'
import { Text } from '@/components/atoms'
import Heading from '../../server/atoms/Heading/Heading'
import { DataTable, Column } from '@molecules/index'

interface ExpedienteRow {
    id: string
    tipoPlaca: string
    placa: string
    estatus: string
    fecha: string
    interesado: string
}

interface RemisionRow {
    id: string
    serie: string
    remision: string
    estatus: string
    numeroResolucion: string
    boletaReformada: string
    observaciones: string
}

const ConsultaForm: React.FC = () => {
    const [juzgado, setJuzgado] = useState("");
    const [resultados, setResultados] = useState(false);

    // Datos de ejemplo para las tablas
    const expedienteData: ExpedienteRow[] = [
        {
        id: 'e1',
        tipoPlaca: 'P',
        placa: '290BBB',
        estatus: 'FINALIZADO',
        fecha: '25-10-2001 13:00:00',
        interesado: 'Feyser Emilio Cáceres Urizar'
        }
    ]

    const remisionesData: RemisionRow[] = [
        {
            id: 'r1',
            serie: 'L',
            remision: '225515151',
            estatus: 'CONFIRMADA',
            numeroResolucion: '10555555',
            boletaReformada: 'E-10507277',
            observaciones: 'Deberá cancelar su totalidad en 5 días'
        },
        {
            id: 'r2',
            serie: 'L',
            remision: '225515152',
            estatus: 'CONFIRMADA',
            numeroResolucion: '10555556',
            boletaReformada: 'E-10507278',
            observaciones: 'Deberá cancelar su totalidad en 5 días'
        }
    ]

    // ——— 2) Columnas de “Información del expediente” ———
    const expedienteCols = useMemo<Column<ExpedienteRow>[]>(() => [
        { key: 'tipoPlaca', label: 'Tipo Placa' },
        { key: 'placa',      label: 'Placa' },
        {
            key: 'estatus',
            label: 'Estatus',
            render: row => <StatusBadge status={row.estatus} />
        },
        { key: 'fecha',      label: 'Fecha' },
        { key: 'interesado', label: 'Nombre del interesado' }
    ], [])

    // ——— 3) Columnas de “Información de remisiones” ———
    const remisionesCols = useMemo<Column<RemisionRow>[]>(() => [
        { key: 'serie',            label: 'Serie' },
        { key: 'remision',         label: 'Remisión' },
        {
            key: 'estatus',
            label: 'Estatus',
            render: row => <StatusBadge status={row.estatus} />
        },
        { key: 'numeroResolucion', label: 'Número de resolución' },
        { key: 'boletaReformada',  label: 'Boleta reformada' },
        { key: 'observaciones',    label: 'Observaciones' }
    ], [])

    return (
        <form className={styles.formBody}>
            <Heading variant="Medium" className={styles.Title}>Datos del expediente</Heading>
            <div className={styles.section}>
                <div className={styles.row}>
                    <div className={styles.formControl}>
                        <Text variant="Small" className={styles.TextStyle}>Número de expediente</Text>
                        <Input id="tipExpediente" type="text" name="tipoExpediente" placeholder="No. Expediente"/>
                    </div>
                    <div className={styles.formControl}>
                        <Text variant="Small" className={styles.TextStyle}>Juzgado</Text>
                            <Select
                                id="juzgado"
                                name="juzgado"
                                options={[
                                    { value: "1", label: "1" },
                                    { value: "2", label: "2" },
                                    { value: "3", label: "3" },
                                ]}
                                value={juzgado}
                                onChange={e => setJuzgado(e.target.value)}
                            />
                    </div>                    
                </div>
            </div>

            {/* Botón */}
            <div className={`${styles.row} ${styles.actions}`}>
                <Button type="button" onClick={() => setResultados(true)}>Buscar</Button>
            </div>
            {resultados && (
                <div className={styles.section}>
                    <Text variant="Small" className={styles.TextStyle}>Información del expediente</Text>
                    <div className={styles.tableContainer}>
                        <DataTable<ExpedienteRow>
                            columns={expedienteCols}
                            data={expedienteData}
                        />
                    </div>
                    <Text variant="Small" className={styles.TextStyle}>Información de remisiones</Text>
                    <div className={styles.tableContainer}>
                        <DataTable<RemisionRow>
                            columns={remisionesCols}
                            data={remisionesData}
                        />
                    </div>
                </div>
                
            )}
            
        </form>
    );
}

export default ConsultaForm;
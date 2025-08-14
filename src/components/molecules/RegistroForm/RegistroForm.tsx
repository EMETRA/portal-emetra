'use client'

import React, {useState, useMemo} from 'react'
import {Input, Button, Icon} from '../../server/atoms/index'
import Select from '../../atoms/Select/Select'
import styles from './RegistroForm.module.scss'
import { Text, Checkbox } from '@/components/atoms'
import Heading from '../../server/atoms/Heading/Heading'
import { DataTable, Column } from '@molecules/index'

interface RemisionRow {
    id: string
    remision: string
    estatus: string
    numeroResolucion: string
    boletaReformada: string
    observaciones: string
}

const RegistroForm: React.FC = () => {
    const [juzgado, setJuzgado] = useState("");
/*     const [sexo, setSexo] = useState("");
 */    const [addingPlate, setAddingPlate] = useState(false)

    const [tipoPlaca, setTipoPlaca] = useState("");
/*     const [numeroPlaca, setNumeroPlaca] = useState("");
 */
    const [misRemisiones] = useState<RemisionRow[]>([
        {
        id: '1',
        remision: '225515151',
        estatus: 'PENDIENTE',
        numeroResolucion: '10555555',
        boletaReformada: 'E-10507277',
        observaciones: 'Deberá cancelar su totalidad en 5 días'
        },
        {
        id: '2',
        remision: '225515152',
        estatus: 'FINALIZADO',
        numeroResolucion: '10555556',
        boletaReformada: 'E-10507278',
        observaciones: 'Sin observaciones'
        }
    ])

    const [selectedRemisiones, setSelectedRemisiones] = useState<string[]>([])
    const toggleSelectRemision = (row: RemisionRow) => {
        setSelectedRemisiones(prev =>
        prev.includes(row.id)
            ? prev.filter(id => id !== row.id)
            : [...prev, row.id]
        )
    }

    const remisionesColumns = useMemo<Column<RemisionRow>[]>(() => [
        {
        key: 'impugnar',
        label: 'Impugnar',
        render: row => (
            <Checkbox
            checked={selectedRemisiones.includes(row.id)}
            onChange={() => toggleSelectRemision(row)}
            />
        )
        },
        { key: 'remision', label: 'Remisión' },
        { key: 'estatus', label: 'Estatus' },
        { key: 'numeroResolucion', label: 'Número de resolución' },
        { key: 'boletaReformada', label: 'Boleta reformada' },
        { key: 'observaciones', label: 'Observaciones' }
    ], [selectedRemisiones])

    return (
        <form className={styles.formBody}>

            {!addingPlate ? (
                <>
                    <Heading variant='Medium' className={styles.Title}> Datos del Solicitante </Heading>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Fecha inicial</Text>
                                <Input id="Fecha_inicial" type ="date" name="nacimiento" placeholder="DD/MM/YYYY"/> 
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
                        
                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Tipo Solicitante</Text>
                                <Input id="solicitante" type ="text" name="solicitante" placeholder="########"/> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Nombre Solicitante</Text>
                                <Input id="nombre" type="text" name="nombre" placeholder="Juan"/>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Apellido Solicitante</Text>
                                <Input id="apellido" type ="text" name="apellido" placeholder="Alvarado"/> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>DPI</Text>
                                <Input id="DPI" type="number" name="DPI" placeholder="1234567890123"/>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Dirección</Text>
                                <Input id="direccion" type ="text" name="direccion" placeholder="Ciudad"/> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Correo electrónico</Text>
                                <Input id="correo" type="number" name="correo" placeholder="juan@gmail.com"/>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Teléfono de casa</Text>
                                <Input id="TelCasa" type ="text" name="TelCasa" placeholder="########"/> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Teléfono celular</Text>
                                <Input id="TelCel" type="number" name="TelCel" placeholder="########"/>
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Sexo</Text>
                                <Select
                                    id="sexo"
                                    name="sexo"
                                    options={[
                                        { value: "M", label: "M" },
                                        { value: "F", label: "F" },
                                    ]}
                                    value={juzgado}
                                    onChange={e => setJuzgado(e.target.value)}
                                />
                            </div>
                        </div>                
                    </div>
                    {/* Botón */}
                    <div className={`${styles.row} ${styles.actions}`}>
                        <Button onClick={() => setAddingPlate(true)}>+ Agregar Placa</Button>
                    </div>
                </>                
                ) : (<>
                    <div className={styles.header}>
                        <Button
                            onClick={() => setAddingPlate(false)}
                            className={styles.backButton}
                        >
                            <Icon name="Back" />
                        </Button>
                        <Heading variant="Medium" className={styles.Title2}>
                            Agregar placa
                        </Heading>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Tipo Placa</Text>
                                    <Select
                                        id="tipoPlaca"
                                        name="tipoPlaca"
                                        options={[
                                            { value: "P", label: "P" },
                                            { value: "M", label: "M" },
                                            { value: "C", label: "C" },
                                        ]}
                                        value={tipoPlaca}
                                        onChange={e => setTipoPlaca(e.target.value)}
                                    />
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Ingrese Placa</Text>
                                <Input id="tipPlaca" type="text" name="tipoPlaca" placeholder="########"/>
                            </div>
                        </div>
                        
                        {/* Tabla de remisiones */}
                        <div className={styles.section}>
                            <Text variant='Medium' className={styles.placaText}>Agregar placa</Text>
                            <div className={styles.tableContainer}>
                                <DataTable<RemisionRow>
                                    columns={remisionesColumns}
                                    data={misRemisiones}
                                />
                            </div>                            
                        </div>
                        {/* Botón */}
                        <div className={`${styles.row} ${styles.actions}`}>
                            <Button onClick={() => setAddingPlate(true)}>Registrar</Button>
                        </div>
                    </div>                
                </>)}

            

            
        </form>
    )
}

export default RegistroForm;
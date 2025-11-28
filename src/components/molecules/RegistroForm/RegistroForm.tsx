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

interface BackendRemision {
  REMISION: string;
  FECHA: string;
  LICENCIA: string;
  CONDUCTOR: string;
  LUGAR: string;
  MONTO: number | string;
}


const RegistroForm: React.FC = () => {
    const [juzgado, setJuzgado] = useState("");
    const [addingPlate, setAddingPlate] = useState(false)

    const [tipoPlaca, setTipoPlaca] = useState("");
    const [numeroPlaca, setNumeroPlaca] = useState("");
    const [loadingRemisiones, setLoadingRemisiones] = useState(false);
    const [remisionesError, setRemisionesError] = useState<string | null>(null);

    const [misRemisiones, setMisRemisiones] = useState<RemisionRow[]>([])


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

    const handleBuscarRemisiones = async () => {
        setRemisionesError(null);

        if (!tipoPlaca || !numeroPlaca) {
            setRemisionesError('Debes ingresar tipo de placa y número de placa.');
            return;
        }

        try {
            setLoadingRemisiones(true);

            const params = new URLSearchParams({
                tipo_placa: tipoPlaca,
                numero_placa: numeroPlaca,
            });

            const res = await fetch(`/api/juzgado/remisiones?${params.toString()}`);

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.message || 'Error al obtener remisiones');
            }

            const data: BackendRemision[] = await res.json();

            const mapped: RemisionRow[] = data.map((item) => ({
                id: item.REMISION,                 
                remision: item.REMISION,
                estatus: 'PENDIENTE',              
                numeroResolucion: '',              
                boletaReformada: '',               
                observaciones: `${item.CONDUCTOR} - ${item.LUGAR} - Q${item.MONTO}`,
            }));

            setMisRemisiones(mapped);
            setSelectedRemisiones([]); 
        } catch (error: any) {
            setRemisionesError(error.message || 'Error desconocido al buscar remisiones');
        } finally {
            setLoadingRemisiones(false);
        }
    };


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
                                        { value: "1", label: "Juzgado Palacio Municipal" },
                                        { value: "2", label: "Juzgado Cenma" },
                                        { value: "3", label: "Juzgado Álamos" },
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
                                <Input id="numeroPlaca" type="text" name="numeroPlaca" placeholder="########"
                                        value={numeroPlaca} onChange={e => setNumeroPlaca(e.target.value)}/>
                            </div>

                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>&nbsp;</Text>
                                <Button onClick={handleBuscarRemisiones}>
                                    {loadingRemisiones ? 'Buscando...' : 'Buscar'}
                                </Button>
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
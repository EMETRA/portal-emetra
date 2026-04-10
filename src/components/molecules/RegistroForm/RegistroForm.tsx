/* eslint-disable @typescript-eslint/no-explicit-any */
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

    const [fechaInicial, setFechaInicial] = useState('')
    const [tipoSolicitante, setTipoSolicitante] = useState('')
    const [nombreSolicitante, setNombreSolicitante] = useState('')
    const [apellidoSolicitante, setApellidoSolicitante] = useState('')
    const [dpi, setDpi] = useState('')
    const [direccion, setDireccion] = useState('')
    const [correo, setCorreo] = useState('')
    const [telCasa, setTelCasa] = useState('')
    const [telCel, setTelCel] = useState('')
    const [sexo, setSexo] = useState('')

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

    const handleRegistrar = async () => {
        try {
            const remisionesSeleccionadas = misRemisiones.filter(r =>
                selectedRemisiones.includes(r.id)
            );

            const remisionesFormatted = remisionesSeleccionadas.map(r => ({
                serie: r.remision.split('-')[0] ?? "",  
                remision: r.remision,
                monto_impugnado: 0, 
            }));

            const payload = {
                juzgado,
                nombres: nombreSolicitante,
                apellidos: apellidoSolicitante,
                direccion,
                telefono: telCasa,
                celular: telCel,
                correo,
                dpi,
                sexo,
                solicitante: tipoSolicitante,
                tipo_placa: tipoPlaca,
                placa: numeroPlaca,
                observaciones: "Observaciones del expediente", 
                remisiones: remisionesFormatted,
            };

            console.log("Payload a enviar:", payload);

            const res = await fetch('/api/juzgado/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                alert("Error registrando expediente: " + error.message);
                return;
            }

            alert("Expediente registrado correctamente");
            setAddingPlate(false);

        } catch (err: any) {
            alert("Error inesperado: " + err.message);
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
                                <Input id="Fecha_inicial" type ="date" name="fecha_inicial" placeholder="DD/MM/YYYY" value={fechaInicial} onChange={e => setFechaInicial(e.target.value)}/> 
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
                                <Input id="solicitante" type ="text" name="solicitante" placeholder="########" value={tipoSolicitante} onChange={e => setTipoSolicitante(e.target.value)} /> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Nombre Solicitante</Text>
                                <Input id="nombre" type="text" name="nombre" placeholder="Juan" value={nombreSolicitante} onChange={e => setNombreSolicitante(e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Apellido Solicitante</Text>
                                <Input id="apellido" type ="text" name="apellido" placeholder="Alvarado" value={apellidoSolicitante} onChange={e => setApellidoSolicitante(e.target.value)} /> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>DPI</Text>
                                <Input id="DPI" type="number" name="DPI" placeholder="1234567890123" value={dpi} onChange={e => setDpi(e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Dirección</Text>
                                <Input id="direccion" type ="text" name="direccion" placeholder="Ciudad" value={direccion} onChange={e => setDireccion(e.target.value)}/> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Correo electrónico</Text>
                                <Input id="correo" type="number" name="correo" placeholder="juan@gmail.com" value={correo} onChange={e => setCorreo(e.target.value)}/>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Teléfono de casa</Text>
                                <Input id="TelCasa" type ="text" name="TelCasa" placeholder="########" value={telCasa} onChange={e => setTelCasa(e.target.value)}/> 
                            </div>
                            <div className={styles.formControl}>
                                <Text variant="Small" className={styles.TextStyle}>Teléfono celular</Text>
                                <Input id="TelCel" type="number" name="TelCel" placeholder="########" value={telCel} onChange={e => setTelCel(e.target.value)}/>
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
                                    value={sexo}
                                    onChange={e => setSexo(e.target.value)}
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
                            {remisionesError && (
                                <Text variant="Small" className={styles.errorText}>
                                    {remisionesError}
                                </Text>
                            )}                         
                        </div>
                        {/* Botón */}
                        <div className={`${styles.row} ${styles.actions}`}>
                            <Button onClick={handleRegistrar}>Registrar</Button>
                        </div>
                    </div>                
                </>)}

            

            
        </form>
    )
}

export default RegistroForm;
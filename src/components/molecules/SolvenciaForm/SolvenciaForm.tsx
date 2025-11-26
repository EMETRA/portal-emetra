'use client'

import React, {useState} from 'react'
import {Input, Button} from '../../server/atoms/index'
import Select from '../../atoms/Select/Select'
import styles from './SolvenciaForm.module.scss'
import { Text } from '@/components/atoms'
import Heading from '../../server/atoms/Heading/Heading'

type MsgType = 'success' | 'error' | null

const SolvenciaForm: React.FC = () => {    
    const [tipoPlaca, setTipoPlaca] = useState("")
    const [placa, setPlaca] = useState("")
    const [fechaRecibo, setFechaRecibo] = useState("")
    const [numeroRecibo, setNumeroRecibo] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [messageType, setMessageType] = useState<MsgType>(null)

    const isEmpty = (s: string) => !s || s.trim() === ''
    const isFormValid =
        !isEmpty(tipoPlaca) &&
        !isEmpty(placa) &&
        !isEmpty(fechaRecibo) &&
        !isEmpty(numeroRecibo)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setMessageType(null)

        if (!isFormValid) {
            setMessage('Por favor complete todos los campos.')
            setMessageType('error')
            return
        }

        setLoading(true)
        const payload = {
            tipoPlaca: tipoPlaca.trim(),
            placa: placa.trim().toUpperCase(),
            fechaRecibo: fechaRecibo.trim(),
            numeroRecibo: numeroRecibo.trim(),
        }
        try {
            const res = await fetch('/api/solvencia/validar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            
            setMessage(data.mensaje)
            setMessageType(data.valido ? 'success' : 'error')
            if (data.valido) {
                const pdfRes = await fetch('/api/solvencia/pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })

                const pdfBlob = await pdfRes.blob()
                const pdfUrl = URL.createObjectURL(pdfBlob)
                const a = document.createElement('a')
                a.href = pdfUrl
                a.download = `solvencia_${placa}.pdf`
                a.click()
                URL.revokeObjectURL(pdfUrl)                
            }

        } catch {
            setMessage('Error al conectar con el servidor.')
            setMessageType('error')
        } finally {
            setLoading(false)
        }
    }

    return(
        <form className={styles.formBody} onSubmit={handleSubmit}>
            <Heading variant='Medium' className={styles.Title}> Ingresar datos de la solvencia </Heading>
            <Text variant='Small' className={styles.SubText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
            </Text>
            <div className={styles.sectionsBody}>
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
                            <Input id="placa" type="text" name="placa" placeholder="########" value={placa} onChange={e => setPlaca(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.row}>
                        <div className={styles.formControl}>
                            <Text variant="Small" className={styles.TextStyle}>Fecha de Recibo</Text>
                            <Input id="fechaRecibo" type ="date" name="fechaRecibo" value={fechaRecibo} onChange={e => setFechaRecibo(e.target.value)} /> 
                        </div>
                        <div className={styles.formControl}>
                            <Text variant="Small" className={styles.TextStyle}>Número de Recibo</Text>
                            <Input id="numeroRecibo" type="text" name="numeroRecibo" placeholder="########" value={numeroRecibo} onChange={e =>setNumeroRecibo(e.target.value)}/>
                        </div>
                    </div>
                </div>               
            </div>
            
            {/* Botón */}
            <div className={`${styles.row} ${styles.actions}`}>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Consultando': 'Generar Solvencia'}
                </Button>                
            </div>
            <div className={`${styles.row} ${styles.actions}` }>
                {message && (
                    <p style={{marginTop: 12, fontSize: 12, lineHeight: 1.4, color: messageType === 'success' ? '#1f7a1f' : '#c1121f'}}>
                        {message}
                    </p>
                )}
            </div>
            
        </form>
    )
}

export default SolvenciaForm
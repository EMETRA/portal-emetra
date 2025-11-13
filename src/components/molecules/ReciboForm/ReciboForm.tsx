'use client'

import React, {useState} from 'react'
import {Input, Button} from '../../server/atoms/index'
import Select from '../../atoms/Select/Select'
import styles from './ReciboForm.module.scss'
import { Text } from '@/components/atoms'
import Heading from '../../server/atoms/Heading/Heading'
import { set } from 'zod'

type MsgType = 'success' | 'error' | null

const ReciboForm: React.FC = () => {
    const [tipoPlaca, setTipoPlaca] = useState("");
    const [placa, setPlaca] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MsgType>(null);
    
    const isEmpty = (s: string) => !s || s.trim() === ''
    const isFormValid = 
        !isEmpty(tipoPlaca) &&
        !isEmpty(placa)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setMessageType(null);

        if (!isFormValid) {
            setMessage('Por favor complete todos los campos.');
            setMessageType('error');
            return;
        }
        setLoading(true);
        const payload = {
            tipoPlaca: tipoPlaca.trim(),
            placa: placa.trim().toUpperCase(),
        };
        try{
            const res = await fetch('api/solvencia/recibo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json();
            setMessage(data.message);
            setMessageType(data.success ? 'success' : 'error');

            if(data.success){
                //generar pdf recibo
            }

        }catch{
            setMessage('Error al conectar con el servidor.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }

    }


    return(
        <form className={styles.formBody} onSubmit={handleSubmit}>
            <Heading variant='Medium' className={styles.Title}> Recibos de pago </Heading>
            <div className={styles.section}>
                <div className={styles.row}>
                    <div className={styles.formControl}>
                        <Text variant="Small" className={styles.TextStyle}>Seleccione Tipo de placa</Text>
                        <Select
                            id="tipoPlaca"
                            name="tipoPlaca"
                            options={[
                                { value: "P", label: "Particular" },
                                { value: "M", label: "Moto" },
                                { value: "C", label: "Camión" },
                            ]}
                            value={tipoPlaca}
                            onChange={e => setTipoPlaca(e.target.value)}
                        />
                    </div>
                    <div className={styles.formControl}>
                        <Text variant="Small" className={styles.TextStyle}>Ingrese placa</Text>
                        <Input id="numeroPlaca" type="text" name="numeroPlaca" placeholder="########" value={placa} onChange={e => setPlaca(e.target.value)}/>
                    </div>
                </div>                
            </div>
            {/* Botón */}
            <div className={`${styles.row} ${styles.actions}`}>
                <Button type="submit">
                    {loading ? 'Consultando' : 'Buscar'}
                </Button>
            </div>
            <div className={`${styles.row} ${styles.actions}`}>
                {message && (
                    <p style={{marginTop: 12, fontSize: 12, lineHeight: 1.4, color: messageType === 'success' ? '#1f7a1f' : '#c1121f'}}>
                        {message}
                    </p>
                )}           
            </div>
        </form>
    )
}

export default ReciboForm;
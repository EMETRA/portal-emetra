'use client'

import React, {useState} from 'react'
import {Input, Button} from '../../server/atoms/index'
import Select from '../../atoms/Select/Select'
import styles from './ReciboForm.module.scss'
import { Text } from '@/components/atoms'
import Heading from '../../server/atoms/Heading/Heading'

const ReciboForm: React.FC = () => {
    const [tipoPlaca, setTipoPlaca] = useState("");
    return(
        <form className={styles.formBody}>
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
                        <Input id="numeroPlaca" type="text" name="numeroPlaca" placeholder="########"/>
                    </div>
                </div>                
            </div>
            {/* Botón */}
            <div className={`${styles.row} ${styles.actions}`}>
                <Button type="submit">Buscar</Button>
            </div>
        </form>
    )
}

export default ReciboForm;
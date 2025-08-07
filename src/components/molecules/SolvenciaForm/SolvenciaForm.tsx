'use client'

import React, {useState} from 'react'
import {Input, Button} from '../../server/atoms/index'
import Select from '../../atoms/Select/Select'
import styles from './SolvenciaForm.module.scss'
import { Text } from '@/components/atoms'
import Heading from '../../server/atoms/Heading/Heading'

const SolvenciaForm: React.FC = () => {
    const [tipoPlaca, setTipoPlaca] = useState("");
    return(
        <form className={styles.formBody}>
            <Heading variant='Medium' className={styles.Title}> Ingresar datos de la solvencia </Heading>
            <Text variant='Small' className={styles.SubText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,</Text>
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
                            <Input id="tipPlaca" type="text" name="tipoPlaca" placeholder="########"/>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.row}>
                        <div className={styles.formControl}>
                            <Text variant="Small" className={styles.TextStyle}>Fecha de Recibo</Text>
                            <Input id="nacimiento" type ="date" name="nacimiento" placeholder="DD/MM/YYYY"/> 
                        </div>
                        <div className={styles.formControl}>
                            <Text variant="Small" className={styles.TextStyle}>Número de Recibo</Text>
                            <Input id="numeroPlaca" type="text" name="numeroPlaca" placeholder="########"/>
                        </div>
                    </div>
                </div>               
            </div>
            
            {/* Botón */}
            <div className={`${styles.row} ${styles.actions}`}>
                <Button type="submit">Generar Solvencia</Button>
            </div>
        </form>
    )
}

export default SolvenciaForm
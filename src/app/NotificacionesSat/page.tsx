'use client'
import React, { useState } from 'react';

import { Separator } from "@/components/atoms/Separator";
import classNames from "classnames";
import styles from "./page.module.scss";
import VehicleQueryCard from '@/components/molecules/VehicleQueryCard/VehicleQueryCard';
const NotificacionesSatPage: React.FC = () => {
    const [plate, setPlate] = useState("C-869BQS");
    return(
        <>
        <div className={classNames(styles.Container)}>
            <Separator color="#83bd3f">
                <p className={classNames(styles.Title)}>Consulta <br/>Vehículo</p>
            </Separator>
            <VehicleQueryCard
                plate={plate}
                onChange={setPlate}
                onSubmit={() => {/* llamar a tu backend */}}
            />
        </div>
            
        </>
    )
}

export default NotificacionesSatPage;
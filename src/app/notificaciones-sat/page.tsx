import classNames from "classnames";
import styles from "./page.module.scss";
import {SatTitle} from '@/components/atoms/index';
import {Button} from '@/components/server/atoms/index';
import { VehicleQueryCard } from '@/components/molecules/index';

const NotificacionesSatPage: React.FC = () => {
    return(
        <div className={classNames(styles.Container)}>
            <SatTitle as="h4" lineColor="#62B44B" lineThickness="2px" gap="5rem">
                Consulta<br/>vehículo
            </SatTitle>
            <VehicleQueryCard initialPlate=""/>
            <div className={styles.Actions}>
                <Button variant="outline" fullWidth className={styles.full}>
                    Pago en línea
                </Button>
                <Button variant="outline" fullWidth className={styles.full}>
                    Obtener Solvencia
                </Button>
                <Button variant="outline" fullWidth className={styles.full}>
                    Predice
                </Button>
            </div>

        </div>
    )
}

export default NotificacionesSatPage;
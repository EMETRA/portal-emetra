import classNames from "classnames";
import styles from "./page.module.scss";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import {Button} from '@/components/server/atoms/index';
import { VehicleQueryCard } from '@/components/molecules/index';
import Link from "next/link";

const NotificacionesSatPage: React.FC = () => {
    return(
        <div className={classNames(styles.Container)}>
            <SectionTitle>
                Consulta<br/>vehículo
            </SectionTitle>
            <VehicleQueryCard initialPlate=""/>
            <div className={styles.Actions}>
                <Link href="https://rejvisa.muniguate.com" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                    <Button variant="outline" fullWidth className={styles.full}>
                        Pago en línea
                    </Button>
                </Link>
                <Link href="/solvencia" className={styles.linkButton}>
                    <Button variant="outline" fullWidth className={styles.full}>
                        Obtener Solvencia
                    </Button>
                </Link>
                <Link href="/predice" className={styles.linkButton}>
                    <Button variant="outline" fullWidth className={styles.full}>
                        Predice
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default NotificacionesSatPage;
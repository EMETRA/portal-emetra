import styles from './SumateInst.module.scss';
import { HowTable } from '@/components/molecules';

const columns = ["Colegios", "Instituciones públicas", "Vecinos y ciudadanos"];

const rows = [
    [
        { title: "Educación a distancia", note: "(1 viernes al mes)" },
        { title: "Horario diferenciado", note: "(Mínimo 3 horarios)" },
        { title: "Evitar desplazamiento en horas pico" },
    ],
    [
        { title: "Horario escalonado o teletrabajo", note: "1 viernes al mes (personal administrativo)" },
        { title: "Teletrabajo parcial o total de forma rotativa", note: "1 viernes al mes (personal administrativo)" },
        { title: "Horario escalonado o teletrabajo", note: "1 viernes al mes (personal administrativo)" },
    ],
    [
        { title: "Carpooling", note: "(Junta de padres)" },
        { title: "Incentivar a empleados para compartir vehículo" },
        { title: "Carpooling", note: "(Junta de padres)" },
    ],
];

const rowColors = ["#D0ED00", "#00C5CF", "#0C0F22"]; 

const SumateInst = () => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>CÓMO SUMARTE</h2>
            <HowTable 
                columns={columns} 
                rows={rows} 
                rowColors={rowColors} 
            />
        </section>
    );
};

export default SumateInst;
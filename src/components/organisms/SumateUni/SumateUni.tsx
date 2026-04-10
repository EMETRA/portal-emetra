import styles from './SumateUni.module.scss';
import { HowTable } from '@/components/molecules';

const columns = ["Universidades"];

const rows = [
    [
        { title: "Horario Escalonado para estudiantes", note: "(3 jornadas diferentes)" }
    ],
    [
        { title: "Horario escalonado", note: "1 viernes al mes (personal administrativo)" }
    ],
    [
        { title: "Teletrabajo", note: "1 viernes al mes (personal administrativo)" }
    ],
    [
        { title: "Educación a distancia", note: "(1 viernes al mes)" }
    ],
    [
        { title: "Carpooling", note: "Organizado por los propios estudiantes" }
    ],
];

const rowColors = ["#D0ED00", "#00C5CF", "#0C0F22", "#D0ED00", "#00C5CF"];

const SumateUni = () => {
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

export default SumateUni;
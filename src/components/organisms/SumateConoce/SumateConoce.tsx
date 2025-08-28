import styles from './SumateConoce.module.scss';
import image1 from "@assets/images/imgConoce1.jpeg";
import image2 from "@assets/images/imgConoce2.jpeg";
import { Text } from '@/components/atoms';

type ImportedImg = string | {src: string};
const toUrl = (img: ImportedImg) => typeof img === 'string' ? img : img.src;

const SumateConoce = () => {
    return (
        <section className={styles.container}>
            <div className={styles.left}>
                <img src={toUrl(image1)} alt="Imagen 1" className={styles.imageBox} />
                <img src={toUrl(image2)} alt="Imagen 2" className={styles.imageBox} />
            </div>
            <img src={toUrl(image2)} alt="Imagen 1" className={styles.imageBoxMob} />
            <div className={styles.right}>
                <p className={styles.title1}>CONOCE EL PROYECTO</p>
                <p className={styles.subtitle}>Súmate a la iniciativa<br/></p>
                <p className={styles.paragraph}>
                    Proponemos implementar un programa que ayude a rimporteducir la congestión vehicular durante las hora pico, y aquellos que puedan todo el día, los días viernes dirigido a empresas, instituciones educativas, instituciones públicas y ciudadanos con el propósito de incentivar el uso de teletrabajo, educación a distancia, horarios escalonados y carpooling y mitigar el congestionamiento por la sobrecarga vehicular en las calles de la ciudad.
                </p>
                <p className={styles.paragraph}>
                    El propósito es avanzar gradualmente, iniciando con 2 viernes de un mes (pago quincena, días de impacto o fin de mes).
                </p>
                <p className={styles.paragraph}>
                    Los actores no necesariamente participarán todos los viernes, sino que se inscribirán al menos a uno de ellos y lo más importante; la participación es VOLUNTARIA.
                </p>
            </div>
        </section>
    )
}

export default SumateConoce;
// import Card from "@/components/atoms/card/Card";
import styles from "./VehicleSolvencyCard.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";

interface VehicleSolvencyCardProps {
    model: string;
    color: string;
    year: number;
    isSolvente: boolean;
    onGenerarSolvencia: () => void;
}

export default function VehicleSolvencyCard({
    model,
    color,
    year,
    isSolvente,
    onGenerarSolvencia,
    }: VehicleSolvencyCardProps) {
    return (
        <CardGeneral className={styles.card}>
        <div className={styles.info}>
            <h2 className={styles.title}>{model}</h2>
            <p className={styles.subtitle}>
            {color} <span className={styles.dot}>•</span> {year}
            </p>
        </div>

        <button
            type="button"
            className={styles.button}
            onClick={onGenerarSolvencia}
            disabled={!isSolvente}
            title={
            isSolvente
                ? undefined
                : "Debes estar solvente para generar este documento"
            }
        >
            Generar Solvencia
        </button>
        </CardGeneral>
    );
}
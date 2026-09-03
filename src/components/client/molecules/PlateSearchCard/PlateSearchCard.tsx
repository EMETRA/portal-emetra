// import Card from "@/components/atoms/card/Card";
// import Select from "@/components/atoms/Select/Select";
import styles from "./PlateSearchCard.module.scss";
import SelectGeneral from "../../atoms/SelectGeneral/SelectGeneral";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";

// interface PlateOption {
//     value: string;
//     label: string;
// }

interface PlateSearchCardProps {
    label?: string;
    options: { value: string; label: string }[];
    selected: string;
    onSelectedChange: (value: string) => void;
    onConsultar: () => void;
}


export default function PlateSearchCard({
    label = "Placa",
    options,
    selected,
    onSelectedChange,
    onConsultar,
}: PlateSearchCardProps) {
    return (
        <CardGeneral className={styles.card}>
        <label className={styles.label}>{label}</label>

        <SelectGeneral options={options} value={selected} onChange={onSelectedChange} placeholder="Seleccione una placa" />


        <button type="button" className={styles.consultButton} onClick={onConsultar}>
            Consultar
        </button>
        </CardGeneral>
    );
}
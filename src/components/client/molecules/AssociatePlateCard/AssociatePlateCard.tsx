// import Card from "@/components/atoms/card/Card";
import styles from "./AssociatePlateCard.module.scss";
import TextInput from "../../atoms/TextInput/TextInput";
import { PLATE_TYPES } from "@/types/plates";
import SelectGeneral from "../../atoms/SelectGeneral/SelectGeneral";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";

interface AssociatePlateCardProps {
    plateType: string;
    plateNumber: string;
    nit: string;
    onPlateTypeChange: (value: string) => void;
    onPlateNumberChange: (value: string) => void;
    onAsociar: () => void;
}

export default function AssociatePlateCard({
    plateType,
    plateNumber,
    nit,
    onPlateTypeChange,
    onPlateNumberChange,
    onAsociar,
    }: AssociatePlateCardProps) {
    return (
        <CardGeneral className={styles.card}>
        <div className={styles.fields}>
            <div className={styles.field}>
            <label className={styles.label}>Tipo Placa</label>
            <SelectGeneral
                options={PLATE_TYPES}
                value={plateType}
                onChange={onPlateTypeChange}
            />
            </div>

            <div className={styles.field}>
            <label className={styles.label}>Número de placa</label>
            <TextInput
                value={plateNumber}
                onChange={onPlateNumberChange}
                placeholder="###XXX"
            />
            </div>

            <div className={styles.nitAndButton}>
            <p className={styles.nit}>
                <strong>NIT asociado:</strong> {nit}
            </p>
            <button type="button" className={styles.asociarButton} onClick={onAsociar}>
                Asociar
            </button>
            </div>
        </div>
        </CardGeneral>
    );
}
import Image from "next/image";
import styles from "./SecurityLogos.module.scss";

export default function SecurityLogos() {
    return (
        <div className={styles.wrapper}>
        <Image
            src="/images/paymentBrands.png"
            alt="Verified by VISA, MasterCard SecureCode, BAC Credomatic"
            width={260}
            height={60}
            style={{ objectFit: "contain" }}
        />
        </div>
    );
}
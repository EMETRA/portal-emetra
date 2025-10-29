import React from "react";
import Text from "@/components/atoms/Text/Text";
import styles from "./SatSocialSection.module.scss";

export default function SatSocialSection() {
    return (
        <section className={styles.Section}>
            {/* Redes Sociales */}
            <div className={styles.col}>
                <Text variant="Large" className={styles.title}>Redes Sociales</Text>
                <div className={`${styles.iconRow} ${styles.icons4}`}>
                    <a className={styles.iconSlot} href="#" aria-label="Facebook">
                        <img className={styles.icon} src="/icons/facebook.png" alt="" />
                        <span className={styles.caption}>Facebook</span>
                    </a>
                    <a className={styles.iconSlot} href="#" aria-label="Twitter">
                        <img className={styles.icon} src="/icons/twitter.png" alt="" />
                        <span className={styles.caption}>Twitter</span>
                    </a>
                    <a className={styles.iconSlot} href="#" aria-label="YouTube">
                        <img className={styles.icon} src="/icons/youtube.png" alt="" />
                        <span className={styles.caption}>You Tube</span>
                    </a>
                    <a className={styles.iconSlot} href="#" aria-label="Instagram">
                        <img className={styles.icon} src="/icons/instagram.png" alt="" />
                        <span className={styles.caption}>Instagram</span>
                    </a>
                </div>
            </div>

            {/* Contáctanos */}
            <div className={styles.col}>
                <Text variant="Large" className={styles.title}>Contáctanos</Text>
                <div className={`${styles.iconRow} ${styles.icons3}`}>
                    <a className={styles.iconSlot} href="#" aria-label="Call Center 1551">
                        <img className={styles.icon} src="/icons/callcenter.png" alt="" />
                        <span className={styles.caption}>1551 Call Center</span>
                    </a>
                    <a className={styles.iconSlot} href="#" aria-label="123 Bomberos">
                        <img className={styles.icon} src="/icons/firefighters.png" alt="" />
                        <span className={styles.caption}>123 Bomberos</span>
                    </a>
                    <a className={styles.iconSlot} href="#" aria-label="Directorio">
                        <img className={styles.icon} src="/icons/directory.png" alt="" />
                        <span className={styles.caption}>Directorio</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

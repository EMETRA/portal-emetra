import React from "react";
import Text from "@/components/atoms/Text/Text";
import styles from "./SatSocialSection.module.scss";

export default function SatSocialSection() {
    return (
        <section className={styles.Section} aria-label="Redes y contacto">
            <div className={styles.Row}>
                {/* Bloque Redes (lado izquierdo) */}
                <div className={styles.Col} data-info="caja_redes">
                    <Text variant="Large" className={styles.title}>Redes Sociales</Text>
                    <div className={`${styles.iconRow} ${styles.icons4}`}>
                        <a className={styles.iconSlot} href="#" aria-label="Facebook">
                            <span className={styles.icon}><img src="/icons/facebook.png" alt="" /></span>
                            <span className={styles.caption}>Facebook</span>
                        </a>
                        <a className={styles.iconSlot} href="#" aria-label="Twitter">
                            <span className={styles.icon}><img src="/icons/twitter.png" alt="" /></span>
                            <span className={styles.caption}>Twitter</span>
                        </a>
                        <a className={styles.iconSlot} href="#" aria-label="YouTube">
                            <span className={styles.icon}><img src="/icons/youtube.png" alt="" /></span>
                            <span className={styles.caption}>You Tube</span>
                        </a>
                        <a className={styles.iconSlot} href="#" aria-label="Instagram">
                            <span className={styles.icon}><img src="/icons/instagram.png" alt="" /></span>
                            <span className={styles.caption}>Instagram</span>
                        </a>
                    </div>
                </div>

                {/* Bloque Contáctanos (lado derecho) */}
                <div className={styles.Col} data-info="caja_contacto">
                    <Text variant="Large" className={styles.title}>Contáctanos</Text>
                    <div className={`${styles.iconRow} ${styles.icons3}`}>
                        <a className={styles.iconSlot} href="#" aria-label="Call Center 1551">
                            <span className={styles.icon}><img src="/icons/callcenter.png" alt="" /></span>
                            <span className={styles.caption}>1551 Call Center</span>
                        </a>
                        <a className={styles.iconSlot} href="#" aria-label="123 Bomberos">
                            <span className={styles.icon}><img src="/icons/firefighters.png" alt="" /></span>
                            <span className={styles.caption}>123 Bomberos</span>
                        </a>
                        <a className={styles.iconSlot} href="#" aria-label="Directorio">
                            <span className={styles.icon}><img src="/icons/directory.png" alt="" /></span>
                            <span className={styles.caption}>Directorio</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

import React from "react";
import styles from "./SumateInscribete.module.scss";
import bgImage from "@/assets/images/FondoFooter.png";

const SumateInscribete: React.FC = () => {
    const bgUrl = typeof bgImage === "string" ? bgImage : (bgImage as { src: string }).src;

    return (
        <div className={styles.background} aria-label="fondo" style={{ backgroundImage: `url(${bgUrl})` }}>
            <div className={styles.content}>
                <div className={styles.box}>
                    <h2 className={styles.title}>QUEREMOS TRABAJAR JUNTO A TI</h2>
                    <p className={styles.subtitle}>
                        Si deseas más información envíanos tu correo y pronto te estaremos contactando:
                    </p>

                    <form className={styles.emailForm}>
                        <input type="email" placeholder="Dirección de correo" />
                        <button type="submit">ENVIAR</button>
                    </form>

                    <div className={styles.contact}>
                        <p><strong>EMETRA:</strong></p>
                        <div>
                            <p>+502 2333-3333</p>
                            <p>info@sumate.gt</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SumateInscribete;

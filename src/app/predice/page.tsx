/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import Image from "next/image";
import classNames from "classnames";
import styles from "./Page.module.scss";
import Link from "next/link";
import PrediceContent from "@/components/client/organisms/PrediceContent/PrediceContent";

export const metadata: Metadata = {
  title: "Predice",
  icons: {
    icon: "/images/Predice.ico",
  },
};

export default function Page() {
  return (
    <div className={classNames(styles.Page)}>
      <div className={classNames(styles.Header)}>
        <Image
          src={"/images/Predice.ico"}
          height={75}
          width={75}
          alt="Logotipo de Predice"
        />
        <h1>PREDICE</h1>
      </div>

      <div className={classNames(styles.AddEventRow)}>
        <Link
          href="/predice/nuevo"
          className={classNames(styles.AddEventButton)}
        >
          Agregar evento
        </Link>
      </div>

      <PrediceContent />

      <h4>En colaboración con:</h4>
      <div className={classNames(styles.LogosRow)}>
        <img
          src="/images/Amatitlan.png"
          alt="Escudo de la Municipalidad de Amatitlán"
          title="Escudo de la Municipalidad de Amatitlán"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Escuintla.png"
          alt="Escudo de la Municipalidad de Escuintla"
          title="Escudo de la Municipalidad de Escuintla"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Fraijanes.png"
          alt="Escudo de la Municipalidad de Fraijanes"
          title="Escudo de la Municipalidad de Fraijanes"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Mixco.png"
          alt="Escudo de la Municipalidad de Mixco"
          title="Escudo de la Municipalidad de Mixco"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Guatemala.png"
          alt="Escudo de la Municipalidad de Guatemala"
          title="Escudo de la Municipalidad de Guatemala"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Petapa.png"
          alt="Escudo de la Municipalidad de San Miguel Petapa"
          title="Escudo de la Municipalidad de San Miguel Petapa"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/Sur.png"
          alt="Escudo de la Mancomunidad Gran Ciudad del Sur"
          title="Escudo de la Mancomunidad Gran Ciudad del Sur"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/VC.png"
          alt="Escudo de la Municipalidad de Villa Canales"
          title="Escudo de la Municipalidad de Villa Canales"
          className={classNames(styles.LogoImg)}
        />
        <img
          src="/images/VN.png"
          alt="Escudo de la Municipalidad de Villa Nueva"
          title="Escudo de la Municipalidad de Villa Nueva"
          className={classNames(styles.LogoImg)}
        />
      </div>
    </div>
  );
}

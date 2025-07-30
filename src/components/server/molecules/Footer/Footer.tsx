import Link from "next/link";
import { Button, Icon } from "../../atoms";
import { Input } from "../../atoms/Input";
import classNames from "classnames";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={classNames(styles.Container)}>
      <form className={classNames(styles.Form)}>
        <div className={classNames(styles.FormContent)}>
          <h4>QUEREMOS TRABAJAR JUNTO A TI</h4>
          <p>
            Si deseas más información envíanos tu correo y pronto te estaremos
            contactando:
          </p>
        </div>
        <div className={classNames(styles.FormInput)}>
          <Input
            placeholder="Introduce tu correo electronico"
            className={classNames(styles.Input)}
          />
          <Button className={classNames(styles.Button)}>Enviar</Button>
        </div>
      </form>
      <div>
        <div className={classNames(styles.Links)}>
          <Link href="/" className={classNames(styles.Link)}>
            Antecedentes
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            Súmate
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            Cómo sumarte
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            Formulario
          </Link>
        </div>
        <div className={classNames(styles.Links)}>
          <Link href="/" className={classNames(styles.Link)}>
            Facebook
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            X
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            Instagram
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

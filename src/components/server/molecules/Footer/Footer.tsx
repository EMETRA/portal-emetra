import Link from "next/link";
import { Icon } from "../../atoms";
import classNames from "classnames";
import styles from "./Footer.module.scss";
import ContactForm from "./ContactForm";

const Footer: React.FC = () => {
  return (
    <footer className={classNames(styles.Container)}>
      {/* <ContactForm /> */}
      <div className={classNames(styles.Below)}>
        {/* <div className={classNames(styles.Links)}>
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
        </div> */}
        <div className={classNames(styles.Links, styles.Social)}>
          <Link href="/" className={classNames(styles.Link)}>
            <Icon name="Facebook" />
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            <Icon name="Twitter" />
          </Link>
          <Link href="/" className={classNames(styles.Link)}>
            <Icon name="Instagram" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { SectionTitle } from "@/components/server/molecules";
import styles from "./Page.module.scss";
export default function DenunciaPage() {
  return <main className={styles.main}><SectionTitle>Denuncia de tránsito</SectionTitle><p>Para consultar tu caso, aceptar la denuncia o descargar la plantilla de defensa, abre el enlace «Aceptar» o «Refutar» del correo de VIVI.</p><p>El número de caso por sí solo no permite consultar ni modificar una denuncia.</p></main>;
}

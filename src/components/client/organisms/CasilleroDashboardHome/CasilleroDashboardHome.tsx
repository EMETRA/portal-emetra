import CasilleroDashboardCard from "@/components/client/molecules/CasilleroDashboardCard/CasilleroDashboardCard";
import styles from "./CasilleroDashboardHome.module.scss";

const user = {
  greeting: "¡Hola! Daniel Morales",
  plates: 1,
  pendingRemissions: 3,
};

export default function CasilleroDashboardHome() {
  return (
    <>
      <div className={styles.summaryGrid}>
        <CasilleroDashboardCard title={user.greeting} icon="User">
          <p>Información de Usuario:</p>
          <p>Placas asociadas: {user.plates}</p>
          <p>Remisiones sin pagar: {user.pendingRemissions}</p>
        </CasilleroDashboardCard>

        <CasilleroDashboardCard title="Notificaciones" icon="Notification">
          <h2>Tienes notificaciones nuevas en tu buzón</h2>
          <a href="#">ir a buzón +</a>
        </CasilleroDashboardCard>
      </div>

      <CasilleroDashboardCard title="Anuncios" icon="Publicidad" wide>
        <div className={styles.announcementBody} />
      </CasilleroDashboardCard>
    </>
  );
}

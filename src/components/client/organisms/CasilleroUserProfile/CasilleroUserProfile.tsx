"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import Text from "@/components/atoms/Text/Text";
import { Button, Input } from "@/components/server/atoms";
import { editProfileSchema } from "./editProfile.schema";
import styles from "./CasilleroUserProfile.module.scss";

const mockUser = {
  id: "300000",
  name: "Daniel Esteban Morales Urizar",
  dpi: "123456789123",
  nit: "12345678",
  email: "user@example.com",
  phone: "12345678",
  profileImage:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='%23bdbdbd'%3E%3Ccircle cx='60' cy='42' r='24'/%3E%3Cellipse cx='60' cy='100' rx='40' ry='28'/%3E%3C/svg%3E",
};

export default function CasilleroUserProfile() {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async  () => {
    try {
      await editProfileSchema.validate({ email, phone });
      alert(`Perfil actualizado correctamente: ${email} ${phone}`);
      setIsEditing(false);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleDeactivate = () => {
    router.push("/casillero/delete-account");
  };

  const handleChangePassword = () => {
    router.push("/casillero/change-password");
  };

  return (
    <div className={styles.wrapper}>
      <SectionTitle>Perfil de usuario</SectionTitle>

      <CardGeneral className={styles.card} padding="lg">
        <div className={styles.layout}>
          <Button
            type="button"
            variant="danger"
            className={styles.deactivateBtn}
            onClick={handleDeactivate}
          >
            Darse de baja
          </Button>

          <div className={styles.infoUserHeader}>
            <Text className={classNames(styles.bold)}>
              {mockUser.name}
            </Text>
            <Text className={classNames(styles.bold)}>
              ID : {mockUser.id}
            </Text>
          </div>

          <div className={styles.infoUserContainer}>
          <div className={styles.fields}>
              <label className={styles.field} htmlFor="profile-dpi">
                <span className={styles.label}>DPI</span>
                <Input
                  id="profile-dpi"
                  type="text"
                  value={mockUser.dpi}
                  disabled
                  className={styles.input}
                />
              </label>

              <label className={styles.field} htmlFor="profile-nit">
                <span className={styles.label}>NIT</span>
                <Input
                  id="profile-nit"
                  type="text"
                  value={mockUser.nit}
                  disabled
                  className={styles.input}
                />
              </label>

              <label className={styles.field} htmlFor="profile-email">
                <span className={styles.label}>Correo electrónico</span>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(event) => setEmail(event.target.value)}
                  className={styles.input}
                />
              </label>

              <label className={styles.field} htmlFor="profile-phone">
                <span className={styles.label}>Celular</span>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  disabled={!isEditing}
                  onChange={(event) => setPhone(event.target.value)}
                  className={styles.input}
                />
              </label>
            </div>

            <div className={styles.infoUserHeaderMobile}>
              <Text className={classNames(styles.bold)}>
                {mockUser.name}
              </Text>
              <Text className={classNames(styles.bold)}>
                ID : {mockUser.id}
              </Text>
            </div>

            <img
              className={styles.avatar}
              src={mockUser.profileImage}
              alt="Foto de perfil"
            />
          </div>

          

          <div className={styles.actions}>
            <Button
              type="button"
              variant="warning"
              className={styles.editBtn}
              onClick={handleEditProfile}
            >
              Editar Perfil
            </Button>
            <Button
              type="button"
              variant="default"
              className={styles.changePasswordBtn}
              onClick={handleChangePassword}
            >
              Cambiar contraseña
            </Button>
          </div>
          <Button
            type="button"
            variant="success"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!isEditing}
          >
            Guardar
          </Button>
        </div>
      </CardGeneral>
    </div>
  );
}

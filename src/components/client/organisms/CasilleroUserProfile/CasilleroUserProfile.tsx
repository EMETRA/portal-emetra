"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import Text from "@/components/atoms/Text/Text";
import { Button, Input, Icon } from "@/components/server/atoms";
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

          <CardGeneral className={styles.infoUserContainer} padding="sm">
            <div className={styles.infoUserBanner}>
              <Image
                className={styles.avatar}
                src={mockUser.profileImage}
                width={110}
                height={110}
                alt="Foto de perfil"
              />
              <div className={styles.infoUserBannerContent}>
                <Text className={styles.infoUserBannerContentName} variant="Large">{mockUser.name}</Text>
                <div className={styles.infoUserBannerContentItems}>  
                  <div className={styles.infoUserBannerContentItem}>
                    <Icon name="Mail" />
                    <div className={styles.infoUserBannerContentItemInfo}>
                      <Text className={styles.infoUserBannerContentItemInfoTitle}>Correo electrónico</Text>
                      <Text className={styles.infoUserBannerContentItemInfoValue}>{mockUser.email}</Text>
                    </div>
                  </div>
                  <div className={styles.infoUserBannerContentItem}>
                    <Icon name="Phone" />
                    <div className={styles.infoUserBannerContentItemInfo}>
                      <Text className={styles.infoUserBannerContentItemInfoTitle}>Teléfono</Text>
                      <Text className={styles.infoUserBannerContentItemInfoValue}>{mockUser.phone}</Text>
                    </div>
                  </div>
                  <div className={styles.infoUserBannerContentItem}>
                    <Icon name="IdCard" />
                    <div className={styles.infoUserBannerContentItemInfo}>
                      <Text className={styles.infoUserBannerContentItemInfoTitle}>ID</Text>
                      <Text className={styles.infoUserBannerContentItemInfoValue}>{mockUser.id}</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CardGeneral className={styles.personalInfoContainer} padding="sm">
              <div className={styles.personalInfoHeader}>
                <Icon name="User" />
                <Text className={styles.personalInfoHeaderTitle} variant="Medium">Información personal</Text>
              </div>

              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Nombre</Text>
                <Text className={styles.personalInfoItemValue}>{mockUser.name}</Text>
              </div>
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Apellido</Text>
                <Text className={styles.personalInfoItemValue}>{"mockUser.lastName"}</Text>
              </div>
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Fecha de nacimiento</Text>
                <Text className={styles.personalInfoItemValue}>{"12/12/2026"}</Text>
              </div>
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Nacionaliad</Text>
                <Text className={styles.personalInfoItemValue}>{"mockUser.nationality"}</Text>
              </div>
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>País de residencia</Text>
                <Text className={styles.personalInfoItemValue}>{"residenceCountry"}</Text>
              </div>
            </CardGeneral>
            
          </CardGeneral>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="default"
              className={styles.changePasswordBtn}
              onClick={handleChangePassword}
            >
              Cambiar contraseña
            </Button>
            <Button
              type="button"
              variant={isEditing ? "danger" : "warning"}
              className={styles.editBtn}
              onClick={handleEditProfile}
            >
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
          {isEditing && (
            <Button
              type="button"
              variant="success"
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!isEditing}
            >
              Guardar
            </Button>
          )}
        </div>
      </CardGeneral>
    </div>
  );
}

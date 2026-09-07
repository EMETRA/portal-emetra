"use client";

import Image from "next/image";
import { useState } from "react";
// import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import CountrySelect from "@/components/client/atoms/CountrySelect/CountrySelect";
import Text from "@/components/atoms/Text/Text";
import { Button, Icon, Input } from "@/components/server/atoms";
// import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { editProfileSchema } from "./editProfile.schema";
import { CasilleroCambioCorreo } from "@/components/client/molecules/CasilleroCambioCorreo/CasilleroCambioCorreo";
import { CasilleroCambioTelefono } from "@/components/client/molecules/CasilleroCambioTelefono/CasilleroCambioTelefono";
import styles from "./CasilleroUserProfile.module.scss";
// import {
//   CasilleroVersionConflictError,
//   fetchMyContacts,
//   fetchMyProfile,
//   updateMyProfile,
// } from "@/lib/casillero/api";
import type {
  CasilleroContact,
  CasilleroPerson,
  CasilleroUser,
} from "@/lib/casillero/types";

const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='%23bdbdbd'%3E%3Ccircle cx='60' cy='42' r='24'/%3E%3Cellipse cx='60' cy='100' rx='40' ry='28'/%3E%3C/svg%3E";

const DUMMY_USER: CasilleroUser = {
  userId: "usr_dummy_001",
  subjectId: "sub_dummy_001",
  status: "ACTIVE",
  email: "daniel.morales@muniguate.com",
  version: 1,
  person: {
    firstName: "Daniel",
    secondName: "Esteban",
    firstLastName: "Morales",
    secondLastName: "Urizar",
    dateOfBirth: "1994-06-18",
    nationality: "GT",
    residenceCountry: "GT",
  },
  emailVerifiedAt: "2026-03-12T15:04:00.000Z",
  currentContext: {
    type: "PERSONAL",
    subjectId: "sub_dummy_001",
    companySubjectId: "",
    membershipId: "",
    companyName: "",
    nit: "1234567-8",
  },
  availableContexts: [
    {
      type: "PERSONAL",
      subjectId: "sub_dummy_001",
      companySubjectId: "",
      membershipId: "",
      companyName: "",
      nit: "1234567-8",
    },
  ],
  session: {
    sessionId: "ses_dummy_001",
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
};

const DUMMY_CONTACTS: CasilleroContact[] = [
  {
    contactId: "cnt_email_001",
    type: "EMAIL",
    value: "daniel.morales@muniguate.com",
    verified: true,
    verifiedAt: "2026-03-12T15:04:00.000Z",
    primary: true,
    status: "ACTIVE",
    validFrom: "2026-03-12T15:04:00.000Z",
    validUntil: "",
    purpose: "ACCESO",
    phoneExtension: "",
  },
  {
    contactId: "cnt_phone_001",
    type: "PHONE",
    value: "+50255551234",
    verified: true,
    verifiedAt: "2026-04-02T10:20:00.000Z",
    primary: true,
    status: "ACTIVE",
    validFrom: "2026-04-02T10:20:00.000Z",
    validUntil: "",
    purpose: "CONTACTO",
    phoneExtension: "",
  },
];

function joinNames(...parts: string[]) {
  return parts.map((part) => part.trim()).filter(Boolean).join(" ");
}

function copyPerson(person: CasilleroPerson): CasilleroPerson {
  return { ...person };
}

function findContact(
  items: CasilleroContact[],
  type: CasilleroContact["type"]
): CasilleroContact | undefined {
  return (
    items.find((item) => item.type === type && item.primary) ??
    items.find((item) => item.type === type)
  );
}

function contactPurposeLabel(purpose: CasilleroContact["purpose"]) {
  if (purpose === "CAMBIO_ACCESO") return "Cambio de acceso";
  if (purpose === "ACCESO") return "Acceso";
  return "Contacto";
}

export default function CasilleroUserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<CasilleroUser>(DUMMY_USER);
  const [contacts] = useState<CasilleroContact[]>(DUMMY_CONTACTS);
  const [form, setForm] = useState<CasilleroPerson>(copyPerson(DUMMY_USER.person));
  // const [user, setUser] = useState<CasilleroUser | null>(null);
  // const [contacts, setContacts] = useState<CasilleroContact[]>([]);
  // const [form, setForm] = useState<CasilleroPerson | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangePhoneOpen, setIsChangePhoneOpen] = useState(false);

  // const loadProfile = async (options?: { silent?: boolean }) => {
  //   if (!options?.silent) {
  //     setIsLoading(true);
  //     setMessage("");
  //   }
  //   try {
  //     const [profile, contactList] = await Promise.all([
  //       fetchMyProfile(),
  //       fetchMyContacts(),
  //     ]);
  //     setUser(profile);
  //     setContacts(contactList.items ?? []);
  //     setForm(copyPerson(profile.person));
  //   } catch (error) {
  //     setUser(null);
  //     setContacts([]);
  //     setForm(null);
  //     setMessage(
  //       error instanceof Error
  //         ? error.message
  //         : "No se pudo cargar el perfil."
  //     );
  //   } finally {
  //     if (!options?.silent) {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   void loadProfile();
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className={styles.wrapper}>
  //       <SectionTitle>Perfil de usuario</SectionTitle>
  //       <div className={styles.loadingState}>
  //         <LoadingSpinner variant="inline" />
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user || !form) {
  //   return (
  //     <div className={styles.wrapper}>
  //       <SectionTitle>Perfil de usuario</SectionTitle>
  //       <p>{message || "Perfil no disponible."}</p>
  //     </div>
  //   );
  // }

  const { person } = user;
  const fullName = joinNames(
    person.firstName,
    person.secondName,
    person.firstLastName,
    person.secondLastName
  );
  const lastName = joinNames(person.firstLastName, person.secondLastName);
  const emailContact = findContact(contacts, "EMAIL");
  const phoneContact = findContact(contacts, "PHONE");
  const primaryEmail = emailContact?.value ?? user.email;
  const primaryPhone = phoneContact?.value ?? "";

  const updateFormField = (field: keyof CasilleroPerson, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditProfile = () => {
    if (isEditing) {
      setForm(copyPerson(user.person));
      setIsEditing(false);
      setMessage("");
      return;
    }

    setForm(copyPerson(user.person));
    setIsEditing(true);
    setMessage("");
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    try {
      await editProfileSchema.validate(form, { abortEarly: true });
    } catch (error) {
      setMessage(
        error instanceof yup.ValidationError
          ? error.message
          : "Revisa los campos personales."
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    const updated: CasilleroUser = {
      ...user,
      version: user.version + 1,
      person: {
        firstName: form.firstName.trim(),
        secondName: form.secondName.trim(),
        firstLastName: form.firstLastName.trim(),
        secondLastName: form.secondLastName.trim(),
        dateOfBirth: form.dateOfBirth,
        nationality: form.nationality,
        residenceCountry: form.residenceCountry,
      },
    };
    setUser(updated);
    setForm(copyPerson(updated.person));
    setIsEditing(false);
    setIsSubmitting(false);

    // try {
    //   const payload = {
    //     firstName: form.firstName.trim(),
    //     secondName: form.secondName.trim() || undefined,
    //     firstLastName: form.firstLastName.trim(),
    //     secondLastName: form.secondLastName.trim() || undefined,
    //     dateOfBirth: form.dateOfBirth,
    //     nationality: form.nationality,
    //     residenceCountry: form.residenceCountry,
    //     expectedVersion: user.version,
    //   };
    //   const updated = await updateMyProfile(payload);
    //   setUser(updated);
    //   setForm(copyPerson(updated.person));
    //   setIsEditing(false);
    // } catch (error) {
    //   if (error instanceof CasilleroVersionConflictError) {
    //     await loadProfile({ silent: true });
    //     setMessage(error.message);
    //     setIsEditing(false);
    //     return;
    //   }
    //   setMessage(
    //     error instanceof Error
    //       ? error.message
    //       : "No se pudo actualizar el perfil."
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
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
                src={FALLBACK_AVATAR}
                width={110}
                height={110}
                alt="Foto de perfil"
              />
              <div className={styles.infoUserBannerContent}>
                <Text className={styles.infoUserBannerContentName} variant="Large">
                  {fullName}
                </Text>
                <div className={styles.infoUserBannerContentItems}>
                  <div className={styles.infoUserBannerContentItem}>
                    <Icon name="Mail" />
                    <div className={styles.infoUserBannerContentItemInfo}>
                      <Text className={styles.infoUserBannerContentItemInfoTitle}>
                        Correo electrónico
                      </Text>
                      <Text className={styles.infoUserBannerContentItemInfoValue}>
                        {primaryEmail}
                      </Text>
                      <Button variant="text" className={styles.requestChangeEmailBtn} onClick={() => setIsChangeEmailOpen(true)}>
                        Solicitar cambio
                      </Button>
                    </div>
                  </div>
                  <div className={styles.infoUserBannerContentItem}>
                    <Icon name="Phone" />
                    <div className={styles.infoUserBannerContentItemInfo}>
                      <Text className={styles.infoUserBannerContentItemInfoTitle}>
                        Teléfono
                      </Text>
                      {primaryPhone ? (	
                        <Text className={styles.infoUserBannerContentItemInfoValue}>
                          {primaryPhone}
                        </Text>
                      ) : (
                        <Button variant="text" className={styles.requestAddPhoneBtn} onClick={() => setIsChangePhoneOpen(true)}>
                          Agregar
                        </Button>
                      )}
                      {primaryPhone && (
                        <Button variant="text" className={styles.requestChangePhoneBtn} onClick={() => setIsChangePhoneOpen(true)}>
                          Cambiar
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className={styles.infoUserBannerContentItem}>
                    <Icon name="IdCard" />
                    <div className={styles.infoUserBannerContentItemInfo}>
                      <Text className={styles.infoUserBannerContentItemInfoTitle}>
                        ID
                      </Text>
                      <Text className={styles.infoUserBannerContentItemInfoValue}>
                        {user.userId}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CardGeneral className={styles.personalInfoContainer} padding="sm">
              <div className={styles.personalInfoHeader}>
                <Icon name="User" />
                <Text className={styles.personalInfoHeaderTitle} variant="Medium">
                  Información personal
                </Text>
              </div>

              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Nombre</Text>
                {isEditing ? (
                  <Input
                    className={styles.personalInfoInput}
                    value={form.firstName}
                    onChange={(event) =>
                      updateFormField("firstName", event.target.value)
                    }
                    required
                  />
                ) : (
                  <Text className={styles.personalInfoItemValue}>
                    {joinNames(person.firstName, person.secondName)}
                  </Text>
                )}
              </div>
              {isEditing && (
                <div className={styles.personalInfoItem}>
                  <Text className={styles.personalInfoItemTitle}>
                    Segundo nombre
                  </Text>
                  <Input
                    className={styles.personalInfoInput}
                    value={form.secondName}
                    onChange={(event) =>
                      updateFormField("secondName", event.target.value)
                    }
                  />
                </div>
              )}
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Apellido</Text>
                {isEditing ? (
                  <Input
                    className={styles.personalInfoInput}
                    value={form.firstLastName}
                    onChange={(event) =>
                      updateFormField("firstLastName", event.target.value)
                    }
                    required
                  />
                ) : (
                  <Text className={styles.personalInfoItemValue}>{lastName}</Text>
                )}
              </div>
              {isEditing && (
                <div className={styles.personalInfoItem}>
                  <Text className={styles.personalInfoItemTitle}>
                    Segundo apellido
                  </Text>
                  <Input
                    className={styles.personalInfoInput}
                    value={form.secondLastName}
                    onChange={(event) =>
                      updateFormField("secondLastName", event.target.value)
                    }
                  />
                </div>
              )}
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>
                  Fecha de nacimiento
                </Text>
                {isEditing ? (
                  <Input
                    className={styles.personalInfoInput}
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) =>
                      updateFormField("dateOfBirth", event.target.value)
                    }
                    required
                  />
                ) : (
                  <Text className={styles.personalInfoItemValue}>
                    {person.dateOfBirth}
                  </Text>
                )}
              </div>
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>Nacionaliad</Text>
                {isEditing ? (
                  <CountrySelect
                    id="nationality"
                    name="nationality"
                    required
                    className={styles.personalInfoInput}
                    value={form.nationality}
                    onChange={(event) =>
                      updateFormField("nationality", event.target.value)
                    }
                  />
                ) : (
                  <Text className={styles.personalInfoItemValue}>
                    {person.nationality}
                  </Text>
                )}
              </div>
              <div className={styles.personalInfoItem}>
                <Text className={styles.personalInfoItemTitle}>
                  País de residencia
                </Text>
                {isEditing ? (
                  <CountrySelect
                    id="residenceCountry"
                    name="residenceCountry"
                    required
                    className={styles.personalInfoInput}
                    value={form.residenceCountry}
                    onChange={(event) =>
                      updateFormField("residenceCountry", event.target.value)
                    }
                  />
                ) : (
                  <Text className={styles.personalInfoItemValue}>
                    {person.residenceCountry}
                  </Text>
                )}
              </div>
            </CardGeneral>
          </CardGeneral>

          {message && <p className={styles.formMessage}>{message}</p>}

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
              disabled={isSubmitting}
            >
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
          {isEditing && (
            <Button
              type="button"
              variant="success"
              className={styles.saveBtn}
              onClick={() => void handleSave()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </div>
      </CardGeneral>
      <CasilleroCambioCorreo
        isOpen={isChangeEmailOpen}
        onClose={() => setIsChangeEmailOpen(false)}
        onCompleted={() => {
          setIsChangeEmailOpen(false);
          // void loadProfile({ silent: true });
        }}
      />
      <CasilleroCambioTelefono isOpen={isChangePhoneOpen} onClose={() => setIsChangePhoneOpen(false)} oldPhone={primaryPhone} />
    </div>
  );
}

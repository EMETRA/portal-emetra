/*
  Creación de usuario
*/

export type ContactVerificationCreated = {
  verificationId: string;
  expiresAt: string;
};

export type ContactVerificationVerified = {
  verificationId: string;
  contactId: string;
  verifiedAt: string;
};

/*
  Creación de solicitud de registro personal
*/

export type RegistrationDocument = {
  type: string;
  number: string;
  country: string;
  issuedOn: string;
  expiresOn: string;
  fileKey: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
};

export type PersonalRegistrationRequest = {
  email: string;
  nit: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  dateOfBirth: string;
  nationality: string;
  residenceCountry: string;
  document: RegistrationDocument;
  termsVersionId: string;
};

export type PersonalRegistrationCreated = {
  registrationId: string;
  trackingCode: string;
  status: string;
  submittedAt: string;
  verificationId: string;
  verificationExpiresAt: string;
};

/**
 * Información del usuario autenticado
 */

export type CasilleroUserStatus = "PENDING_ACTIVATION" | "ACTIVE";

export type CasilleroContextType = "PERSONAL" | "EMPRESA";

export type CasilleroPerson = {
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  nationality: string;
  residenceCountry: string;
};

export type CasilleroUserContext = {
  type: CasilleroContextType;
  subjectId: string;
  companySubjectId: string;
  membershipId: string;
  companyName: string;
  nit: string;
};

export type CasilleroUserSession = {
  sessionId: string;
  expiresAt: string;
};

export type CasilleroUser = {
  userId: string;
  subjectId: string;
  status: CasilleroUserStatus;
  email: string;
  version: number;
  person: CasilleroPerson;
  emailVerifiedAt: string;
  currentContext: CasilleroUserContext;
  availableContexts: CasilleroUserContext[];
  session: CasilleroUserSession;
};

export type CasilleroUpdateMeRequest = {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  dateOfBirth: string;
  nationality: string;
  residenceCountry: string;
  expectedVersion: number;
};

/**
 * Contactos del usuario (email, teléfono)
 */

export type CasilleroContactType = "EMAIL" | "PHONE";

export type CasilleroContactStatus = "ACTIVE" | "INACTIVE";

export type CasilleroContactPurpose =
  | "CAMBIO_ACCESO"
  | "CONTACTO"
  | "ACCESO";

export type CasilleroContact = {
  contactId: string;
  type: CasilleroContactType;
  value: string;
  verified: boolean;
  verifiedAt: string;
  primary: boolean;
  status: CasilleroContactStatus;
  validFrom: string;
  validUntil: string;
  purpose: CasilleroContactPurpose;
  phoneExtension: string;
};

export type CasilleroContactList = {
  items: CasilleroContact[];
};

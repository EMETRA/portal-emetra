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

export type CasilleroContextType = "PERSONAL" | "COMPANY";

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

/**
 * Solicitud de cambio de correo de acceso
 */

export type CasilleroEmailChangeStatus =
  | "PENDING_EMAIL_VERIFICATION"
  | "PENDING_STEP_UP"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type CasilleroEmailChangeSessionPolicy =
  | "KEEP"
  | "REVOKE_OTHERS"
  | "REVOKE_ALL";

export type CasilleroEmailChangeNextStep =
  | "VERIFY_NEW_EMAIL"
  | "COMPLETE_STEP_UP_2FA";

export type CasilleroEmailChangeRequest = {
  newEmail: string;
};

export type CasilleroEmailChangeCreated = {
  requestId: string;
  status: CasilleroEmailChangeStatus;
  verificationId: string;
  verificationExpiresAt: string;
  currentEmailMasked: string;
  newEmailMasked: string;
  stepUpRequired: boolean;
  sessionPolicyOnCompletion: CasilleroEmailChangeSessionPolicy;
  nextSteps: CasilleroEmailChangeNextStep[];
  setUpChallengeId?: string;
};

export type CasilleroEmailChangeCompleteRequest = {
  verificationId: string;
  newEmailCode: string;
  setUpChallengeId: string;
  stepUpCode: string;
};

/*
  Consulta de estado de solicitud de registro.
*/

export type RegistrationStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface RegistrationObservation {
  message: string;
  recordedAt: string;
}

export interface RegistrationStatusResponse {
  trackingCode: string;
  status: RegistrationStatus;
  submittedAt: string;
  observations: RegistrationObservation[];
}

/*
  Autenticación de usuario
*/

export type TwoFactorType = "CORREO" | "TOTP" | "RECUPERACION";

export interface AvailableFactor {
  id: string;
  type: TwoFactorType;
  preferred: boolean;
  destinationMasked?: string; // solo en CORREO
}

export interface LoginResponse {
  challengeId: string;
  expiresAt: string;
  availableFactors: AvailableFactor[];
}

/**
 * Respuesta del BFF al verificar el segundo factor. El backend devuelve sessionToken y
 * expiresAt; el BFF guarda el token en la cookie httpOnly y al navegador solo le pasa
 * el vencimiento.
 */
export interface VerifyResponse {
  expiresAt: string | null;
}

export interface ResendResponse {
  challengeId: string;
  expiresAt: string;
  destinationMasked: string;
}

/*
  Buzón de notificaciones (CAS-133)
  TODO [CASILLERO-BACKEND]: contrato provisional (Daniel, 2026-10-14). Confirmados:
  `items`, `nextCursor` y `hasDocument`. El resto de nombres (subject, summary, status,
  issuedAt, context, content) son provisionales hasta que se publique el contrato.
*/

export type CasilleroNotificationItem = {
  id: string;
  subject: string;
  summary: string;
  status: string;
  /** Fecha de emisión/disponibilidad (ISO 8601). */
  issuedAt: string;
  context: CasilleroContextType;
  hasDocument: boolean;
};

/** GET /v1/notifications?limit&cursor: paginación por cursor, sin total. */
export type CasilleroNotificationList = {
  items: CasilleroNotificationItem[];
  nextCursor: string | null;
};

/** GET /v1/notifications/{id}: los datos del listado más el contenido. */
export type CasilleroNotificationDetail = CasilleroNotificationItem & {
  content: string;
};

/*
  Cobros: vehículos del usuario y sus obligaciones pagables (CAS-132)
  - Vehículos: ruta, parámetros y campos tomados del Swagger del backend; Daniel
    confirmó (2026-10-28) que el cursor de la siguiente página viene en `nextCursor`.
    TODO [CASILLERO-BACKEND]: modelo, color y año vendrán cuando backend integre SAT;
    aún no hay nombres de campos.
  - Obligaciones: TODO [CASILLERO-BACKEND]: formato provisional. El ticket solo nombra
    concepto, monto, saldo, estado y vencimiento; los nombres (concept, amount, balance,
    status, dueDate), los valores del estado, `category` y que el listado venga completo
    (sin paginación) son supuestos. El id del vehículo en la ruta es su
    `vehicleReference` (confirmado por Daniel, 2026-10-28).
*/

export type CasilleroVehicle = {
  /** Id del vehículo para pedir sus obligaciones. */
  vehicleReference: string;
  /** Número sin el tipo, p. ej. "111BBB". */
  plateNumber: string;
  /** País ISO de la placa, p. ej. "GT". */
  plateCountry: string;
  /** Código público del tipo de placa, p. ej. "P". */
  plateTypeCode: string;
  foreignPlate: boolean;
  associationStatus: string;
  accessType: string;
  ownershipType: string;
  /** Fecha de asociación al usuario (ISO 8601). */
  associatedAt: string;
};

/**
 * GET /v1/vehicles?cursor&limit&plateCountry&plateTypeCode: vehículos con asociación
 * activa del contexto actual (persona o empresa), paginados por cursor. En la primera
 * página el cursor va vacío.
 */
export type CasilleroVehicleList = {
  items: CasilleroVehicle[];
  nextCursor?: string | null;
};

/** Valores provisionales del estado de una obligación. */
export type CasilleroObligationStatus = "PENDIENTE" | "VENCIDA" | "EN_PROCESO" | "PAGADA";

export type CasilleroObligation = {
  id: string;
  concept: string;
  /** Monto original, en quetzales. */
  amount: number;
  /** Lo que falta por pagar, en quetzales. */
  balance: number;
  status: CasilleroObligationStatus;
  /** Fecha límite de pago (ISO 8601). */
  dueDate: string;
  /** Opcional: si viene, la pantalla muestra los filtros por categoría. */
  category?: string;
};

/** GET /v1/vehicles/{id}/obligations */
export type CasilleroObligationList = {
  items: CasilleroObligation[];
};

/** GET /v1/obligations/{id}: por ahora los mismos datos del listado. */
export type CasilleroObligationDetail = CasilleroObligation;
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
  registrationId: string;
};

/*
  Creación de solicitud de registro personal
*/

export type RegistrationDocument = {
  type: string;
  number: string;
  country?: string;
  issuedOn?: string;
  expiresOn?: string;
};

export type PersonalRegistrationRequest = {
  email: string;
  nit: string;
  phone: string;
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
  nit?: string;
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

export type RegistrationStatus = "PENDING" | "UNDER_REVIEW" | "OBSERVED" | "APPROVED" | "REJECTED";

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
    `plateNumber` ya trae el tipo ("P123ABC") y `plateTypeCode` es el nombre del tipo
    ("PARTICULAR"); la placa se muestra tal cual viene en `plateNumber`.
    Marca, modelo, color y año vienen en el detalle: GET /v1/vehicles/{reference}.
  - Obligaciones: ruta, parámetros y campos tomados del Swagger del backend (Daniel,
    2026-11). El id del vehículo en la ruta es su `vehicleReference` (confirmado por
    Daniel, 2026-10-28). El header opcional de empresa (x-portal-company-subject-id) no se
    manda: el modo empresa lo trabaja Elías; sin él la API usa el contexto personal.
    Confirmado por Daniel (2026-11-11):
      · el listado responde `nextCursor` cuando hay otra página; si no viene, terminó;
      · chargeType, referenceStatus y sourceStatus no tienen catálogo (texto libre);
      · unavailableReason tiene valores fijos (CasilleroUnavailableReason) o null;
      · validUntil es hasta cuándo vale el monto calculado, no la fecha límite legal para
        pagar; puede venir null.
*/

export type CasilleroVehicle = {
  /** Id del vehículo para pedir sus obligaciones. */
  vehicleReference: string;
  /** Placa completa, ya con el tipo, p. ej. "P123ABC". Se muestra tal cual. */
  plateNumber: string;
  /** País ISO de la placa, p. ej. "GT". */
  plateCountry: string;
  /** Tipo de placa con nombre, p. ej. "PARTICULAR" (no la letra). */
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

/** Vigencia de la asociación o de la propiedad en el detalle del vehículo. */
export type CasilleroVehicleVigencia = {
  validFrom: string | null;
  validUntil: string | null;
};

/**
 * GET /v1/vehicles/{reference}: detalle de un vehículo accesible (Swagger, 2026-11-11).
 * Inexistente, ajeno o con relación vencida = 404. Los datos del vehículo (marca, modelo,
 * color, año, VIN) se tipan como opcionales por si alguno no viene.
 */
export type CasilleroVehicleDetail = {
  vehicleReference: string;
  plateNumber: string;
  plateCountry: string;
  plateTypeCode: string;
  foreignPlate: boolean;
  vin?: string | null;
  make?: string | null;
  model?: string | null;
  color?: string | null;
  year?: number | null;
  association?: (CasilleroVehicleVigencia & { status: string; accessType: string }) | null;
  ownership?: (CasilleroVehicleVigencia & { type: string }) | null;
};

/**
 * Monto decimal exacto como texto, p. ej. "100" o "125.50". La API los manda como texto
 * para no perder centavos; se convierten con `montoACentavos` (lib/casillero/obligations).
 */
export type CasilleroMonto = string;

/** Por qué no se puede pagar una obligación (valores fijos de la API). */
export type CasilleroUnavailableReason =
  | "PAID"
  | "NO_PROJECTION"
  | "TYPE_DISABLED"
  | "SOURCE_NOT_PAYABLE"
  | "EXPIRED"
  | "NO_AMOUNT_DUE";

export type CasilleroObligation = {
  id: string;
  vehicleReference: string;
  concept: string;
  /** Tipo de cobro, p. ej. "REMISION". Texto libre, sin catálogo. */
  chargeType: string;
  /** Referencia en el sistema de origen, p. ej. "1:N:456123". */
  sourceReference?: string | null;
  /** Serie de la remisión, p. ej. "N". */
  series?: string | null;
  /** Número de la remisión, p. ej. "456123". */
  number?: string | null;
  /** Estado de la referencia, p. ej. "ACTIVA". Texto libre, sin catálogo. */
  referenceStatus: string;
  /** Estado en el sistema de origen, p. ej. "ACTIVA". Texto libre, sin catálogo. */
  sourceStatus: string;
  /** Moneda ISO, p. ej. "GTQ". */
  currency: string;
  baseAmount: CasilleroMonto;
  surcharge: CasilleroMonto;
  discount: CasilleroMonto;
  /** Lo que se paga: base + recargo − descuento. */
  totalAmount: CasilleroMonto;
  /**
   * TODO [CASILLERO-BACKEND]: campo nuevo del Swagger (2026-11-11), sin explicación. En el
   * ejemplo vale lo mismo que totalAmount. Mientras Daniel aclara qué es, no se usa: se
   * muestra y se paga totalAmount.
   */
  saldo?: CasilleroMonto | null;
  /** Fecha de emisión (ISO 8601). */
  issuedAt: string;
  /** Cuándo se calculó el monto (ISO 8601). */
  consultedAt: string;
  /**
   * Hasta cuándo vale el monto calculado (ISO 8601). No es la fecha límite legal para
   * pagar la multa. null = sin vencimiento explícito.
   */
  validUntil: string | null;
  /** La API decide si se puede pagar; no se deduce en el front. */
  payable: boolean;
  /**
   * Motivo cuando `payable` es false; null si se puede pagar. Se tipa también como string
   * para no romper la pantalla si backend agrega un código nuevo.
   */
  unavailableReason: CasilleroUnavailableReason | (string & {}) | null;
};

/**
 * GET /v1/vehicles/{vehicleReference}/obligations?limit&cursor: incluye las no pagables,
 * en orden ascendente por id.
 */
export type CasilleroObligationList = {
  items: CasilleroObligation[];
  /** Cursor de la siguiente página; si no viene, terminó el listado. */
  nextCursor?: string | null;
};

/** GET /v1/obligations/{id}: mismos campos que el listado. Ajena o inexistente = 404. */
export type CasilleroObligationDetail = CasilleroObligation;

/*
  Órdenes de pago (CAS-132)
  TODO [CASILLERO-BACKEND]: formato provisional. El ticket solo nombra los endpoints y que la
  pantalla distinga orden creada, pago en proceso, pago confirmado y "esperar o volver a
  consultar". Los nombres de los campos, los valores del estado y que una orden pueda llevar
  varios cobros son supuestos (lo de varios cobros lo está viendo Jenny).
*/

/**
 * - CREADA: la orden existe, falta pagarla (checkout).
 * - EN_PROCESO: el pago se está aplicando. Aunque Neonet ya haya autorizado, sigue aquí
 *   hasta que la aplicación interna termine.
 * - CONFIRMADA: pago aplicado; es el único estado que se muestra como éxito.
 * - RECHAZADA / VENCIDA: no se pagó.
 */
export type CasilleroPaymentOrderStatus =
  | "CREADA"
  | "EN_PROCESO"
  | "CONFIRMADA"
  | "RECHAZADA"
  | "VENCIDA";

/** POST /v1/payment-orders */
export type CasilleroCreatePaymentOrderRequest = {
  obligationIds: string[];
};

/** Respuesta de POST /v1/payment-orders y GET /v1/payment-orders/{id}. */
export type CasilleroPaymentOrder = {
  id: string;
  status: CasilleroPaymentOrderStatus;
  /** Total a pagar, en quetzales. */
  totalAmount: number;
  obligationIds: string[];
  /** ISO 8601 */
  createdAt: string;
  /** Hasta cuándo se puede pagar la orden (ISO 8601). */
  expiresAt?: string;
};

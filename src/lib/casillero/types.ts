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
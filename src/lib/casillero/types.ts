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

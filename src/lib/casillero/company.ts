"use client";

import { createIdempotencyKey } from "./api";

export class CompanyClientError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "CompanyClientError";
  }
}

export type CompanyRegistrationStatus = "PENDING" | "UNDER_REVIEW" | "OBSERVED" | "APPROVED" | "REJECTED";

export type CompanyRegistrationCreated = {
  id: string;
  status: "PENDING";
  submittedAt: string;
  version: number;
};

export type CompanyRegistrationDocument = {
  id: string;
  type: "REPRESENTACION_LEGAL" | "OTRO";
  fileKey: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  status: string;
  uploadedAt: string;
};

export type CompanyRegistrationRequest = {
  id: string;
  companyId?: string;
  nit: string;
  razonSocial: string;
  status: CompanyRegistrationStatus;
  priority: number;
  submittedAt: string;
  resolvedAt?: string;
  observation?: string;
  version: number;
  documents: CompanyRegistrationDocument[];
};

export type CompanyRegistrationListItem = Omit<CompanyRegistrationRequest, "priority" | "documents"> & {
  documentCount: number;
};

export type CompanyMembership = { id: string; position?: string; validFrom: string };
export type CompanySummary = {
  companyId: string;
  nit: string;
  legalName: string;
  commercialName?: string;
  countryIso: string;
  incorporationDate?: string;
  registrationStatus: string;
  membership: CompanyMembership;
};
export type CompanyList = { items: CompanySummary[] };
export type CompanyRole = { code: string; name: string };

export type CompanyMemberRole = { code: string; name: string; validFrom: string; validUntil?: string };
export type CompanyMember = {
  membershipId: string;
  version: number;
  personId: string;
  fullName: string;
  position?: string;
  status: string;
  validFrom: string;
  validUntil?: string;
  roles: CompanyMemberRole[];
};
export type CompanyMemberList = { companyId: string; items: CompanyMember[] };

export type CompanyInvitation = {
  invitationId: string;
  companyId: string;
  companyName: string;
  invitedEmail: string;
  proposedRoleCode?: string;
  proposedRoleName?: string;
  status: string;
  createdAt: string;
  expiresAt: string;
};

async function companyRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: unknown; title?: unknown } | null;
    const detail = typeof problem?.detail === "string" ? problem.detail : undefined;
    const title = typeof problem?.title === "string" ? problem.title : undefined;
    throw new CompanyClientError(response.status, detail || title || `No se pudo completar la operación (HTTP ${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export async function createCompanyRegistrationRequest(input: {
  nit: string;
  razonSocial: string;
  representationLegalFile: File;
  otherFiles?: readonly File[];
  idempotencyKey?: string;
}): Promise<CompanyRegistrationCreated> {
  const form = new FormData();
  form.append("nit", input.nit);
  form.append("razonSocial", input.razonSocial);
  form.append("representationLegalFile", input.representationLegalFile);
  input.otherFiles?.forEach((file) => form.append("otherFiles", file));
  return companyRequest("/api/casillero/company-registration-requests", {
    method: "POST",
    headers: { "Idempotency-Key": input.idempotencyKey ?? createIdempotencyKey() },
    body: form,
  });
}

export function getCompanyRegistrationRequest(id: string): Promise<CompanyRegistrationRequest> {
  return companyRequest(`/api/casillero/company-registration-requests/${encodeURIComponent(id)}`);
}

export async function getCompanyRegistrationRequests(): Promise<CompanyRegistrationListItem[]> {
  return (await companyRequest<{ items: CompanyRegistrationListItem[] }>("/api/casillero/company-registration-requests")).items;
}

export async function getCompanies(): Promise<CompanySummary[]> {
  return (await companyRequest<CompanyList>("/api/casillero/companies")).items;
}

export async function getCompanyRoles(): Promise<CompanyRole[]> {
  return (await companyRequest<{ items: CompanyRole[] }>("/api/casillero/company-roles")).items;
}

export async function activateCompanyContext(companyId: string): Promise<void> {
  const response = await fetch("/api/casillero/company-context", {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ companyId }),
  });
  if (!response.ok) throw new CompanyClientError(response.status, "No se pudo activar el contexto empresarial.");
  window.dispatchEvent(new CustomEvent("company-context-changed", { detail: { companyId } }));
}

export async function deactivateCompanyContext(): Promise<void> {
  await fetch("/api/casillero/company-context", { method: "DELETE" });
  window.dispatchEvent(new CustomEvent("company-context-changed", { detail: { companyId: null } }));
}

export async function getActiveCompanyContext(): Promise<string | null> {
  const response = await fetch("/api/casillero/company-context", { cache: "no-store" });
  if (!response.ok) return null;
  return ((await response.json()) as { companyId: string | null }).companyId;
}

export function getCompany(id: string): Promise<CompanySummary> {
  return companyRequest(`/api/casillero/companies/${encodeURIComponent(id)}`);
}

export async function getCompanyMembers(companyId: string): Promise<CompanyMember[]> {
  return (await companyRequest<CompanyMemberList>(`/api/casillero/companies/${encodeURIComponent(companyId)}/members`)).items;
}

export function createCompanyInvitation(companyId: string, input: { email: string; roleCode?: string }) {
  return companyRequest(`/api/casillero/companies/${encodeURIComponent(companyId)}/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function getMyCompanyInvitations(): Promise<CompanyInvitation[]> {
  return (await companyRequest<{ items: CompanyInvitation[] }>("/api/casillero/me/company-invitations")).items;
}

export function acceptCompanyInvitation(id: string) {
  return companyRequest(`/api/casillero/me/company-invitations/${encodeURIComponent(id)}/accept`, { method: "POST" });
}

export function rejectCompanyInvitation(id: string) {
  return companyRequest(`/api/casillero/me/company-invitations/${encodeURIComponent(id)}/reject`, { method: "POST" });
}

export function updateMemberRoles(
  companyId: string,
  memberId: string,
  roleCodes: string[],
  version: number,
  reason?: string,
) {
  return companyRequest(`/api/casillero/companies/${encodeURIComponent(companyId)}/members/${encodeURIComponent(memberId)}/roles`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "If-Match": String(version) },
    body: JSON.stringify({ roleCodes, reason, expectedVersion: version }),
  });
}

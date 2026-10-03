import { assertOkResponse } from "@/lib/bff/raw";
import type { Case, defenseData } from "@/lib/vivi/types";

export type { Case, DefenseFile, defenseData } from "@/lib/vivi/types";

export async function fetchDenunciaByIdClient(
  id: string
): Promise<Case | null> {
  const response = await fetch(
    `/api/vivi/denuncias/${encodeURIComponent(id)}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  await assertOkResponse(response);
  return (await response.json()) as Case;
}

export async function submitDefenseClient(
  caseId: string,
  payload: defenseData
): Promise<unknown> {
  const formData = new FormData();
  formData.set("name", payload.name);
  formData.set("personalDocumentType", payload.personalDocumentType);
  if (payload.dpi) {
    formData.set("dpi", payload.dpi);
  }
  if (payload.passport) {
    formData.set("passport", payload.passport);
  }
  formData.set("email", payload.email);
  formData.set("phone", payload.phone);
  formData.set("arguments", payload.arguments);
  formData.set("declaration", String(payload.declaration));

  for (const file of payload.attachments) {
    formData.append("attachments", file);
  }

  const response = await fetch(
    `/api/vivi/denuncias/${encodeURIComponent(caseId)}/defensa`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    }
  );

  await assertOkResponse(response);

  if (response.status === 204) {
    return null;
  }

  const body = await response.text();
  if (!body) {
    return null;
  }

  return JSON.parse(body) as unknown;
}

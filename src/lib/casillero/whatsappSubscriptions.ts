export type WhatsAppSubscriptionStatus = "PENDING" | "ACTIVE" | "PAUSED" | "UNSUBSCRIBED";
export type WhatsAppSubscriptionAction = "PAUSE" | "RESUME" | "UNSUBSCRIBE";

export type WhatsAppSubscription = {
  id: string;
  subjectId: string;
  contactId: string;
  scope: "ACTIVE_ASSOCIATIONS";
  status: WhatsAppSubscriptionStatus;
  consentedAt: string;
  confirmedAt?: string;
  pausedAt?: string;
  unsubscribedAt?: string;
  version: number;
};

export class WhatsAppSubscriptionError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "WhatsAppSubscriptionError";
  }
}

async function result<T>(response: Response, fallback: string): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  const problem = (await response.json().catch(() => null)) as
    | { detail?: unknown; title?: unknown }
    | null;
  const message =
    (typeof problem?.detail === "string" && problem.detail.trim()) ||
    (typeof problem?.title === "string" && problem.title.trim()) ||
    fallback;
  throw new WhatsAppSubscriptionError(message, response.status);
}

export async function fetchWhatsAppSubscriptions(): Promise<WhatsAppSubscription[]> {
  const response = await fetch("/api/casillero/whatsapp-subscriptions", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const body = await result<{ items: WhatsAppSubscription[] }>(
    response,
    "No se pudo consultar la suscripción de WhatsApp."
  );
  return body.items ?? [];
}

export async function createWhatsAppSubscription(
  contactId: string
): Promise<WhatsAppSubscription> {
  const response = await fetch("/api/casillero/whatsapp-subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ contactId, consent: true }),
    cache: "no-store",
  });
  return result(response, "No se pudo activar la suscripción de WhatsApp.");
}

export async function changeWhatsAppSubscription(
  subscription: WhatsAppSubscription,
  action: WhatsAppSubscriptionAction
): Promise<WhatsAppSubscription> {
  const response = await fetch(
    `/api/casillero/whatsapp-subscriptions/${encodeURIComponent(subscription.id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "If-Match": String(subscription.version),
      },
      body: JSON.stringify({ action }),
      cache: "no-store",
    }
  );
  return result(response, "No se pudo actualizar la suscripción de WhatsApp.");
}

import "server-only";

export const AUTH_COOKIE_NAME = "portal_auth_token";

export function isAppAuthorizationEnabled(): boolean {
  return Boolean(process.env.APP_AUTH_TOKEN?.trim());
}

export function isValidAppToken(token: string | null | undefined): boolean {
  const expected = process.env.APP_AUTH_TOKEN?.trim();
  if (!expected) {
    return true;
  }
  return Boolean(token) && token === expected;
}

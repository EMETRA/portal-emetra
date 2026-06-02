/**
 * Reads the response body as text for display or debugging.
 * Does not map or normalize backend error shapes.
 */
export async function readResponseBody(response: Response): Promise<string> {
  return response.text();
}

/**
 * Throws an Error whose message is the raw response body (for failed fetches).
 */
export async function assertOkResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const body = await readResponseBody(response);
    const error = new Error(body || `HTTP ${response.status}`);
    error.name = "ApiResponseError";
    throw error;
  }
}

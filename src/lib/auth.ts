export const SESSION_COOKIE = "cochas_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno SESSION_SECRET.");
  }
  return secret;
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(signature).toString("hex");
}

/** Token de sesión: no contiene la clave, solo una firma derivada de ella. */
export async function createSessionToken() {
  return hmac("cochas-authenticated", getSecret());
}

function timingSafeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  // Compara siempre contra la longitud esperada para no filtrar la longitud real por timing.
  const length = Math.max(bufA.length, bufB.length, 1);
  let diff = bufA.length === bufB.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
  }
  return diff === 0;
}

export async function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const expected = await createSessionToken();
  return timingSafeEqual(token, expected);
}

export function isValidPassword(candidate: string) {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    throw new Error("Falta la variable de entorno APP_PASSWORD.");
  }
  return timingSafeEqual(candidate, password);
}

import { SignJWT, jwtVerify } from "jose"

const DEFAULT_SECRET = "manoj$#@Monster"

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET
  return new TextEncoder().encode(secret)
}

export async function signAuthToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(getJwtSecretKey())
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())
    return payload
  } catch (_e) {
    return null
  }
}

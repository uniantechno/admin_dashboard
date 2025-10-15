import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const DEFAULT_SECRET = "manoj$#@Monster"
function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET
  return new TextEncoder().encode(secret)
}

async function isValid(token) {
  try {
    await jwtVerify(token, getJwtSecretKey())
    return true
  } catch {
    return false
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("auth_token")?.value

  const isAuthRoute = pathname.startsWith("/api/login") || pathname.startsWith("/api/logout")
  const isPublicAsset = pathname.startsWith("/_next/") || pathname.startsWith("/images") || pathname === "/favicon.ico"

  if (isPublicAsset) return NextResponse.next()

  // Treat "/" as the login page
  if (pathname === "/") {
    if (token && (await isValid(token))) {
      const url = req.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Allow auth endpoints to be accessed without token
  if (isAuthRoute) return NextResponse.next()

  // Protect everything else
  if (!token || !(await isValid(token))) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.*).*)"],
}

import { NextResponse } from "next/server"
import { signAuthToken } from "@/lib/auth"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@123"

export async function POST(request) {
  let body = {}
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    body = await request.json()
  } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData()
    body = Object.fromEntries(form.entries())
  } else {
    // fallback: try json
    try {
      body = await request.json()
    } catch {
      body = {}
    }
  }

  const { username, password } = body

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = await signAuthToken({ username })
    const res = NextResponse.json({ ok: true })
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    })
    return res
  }

  return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
}

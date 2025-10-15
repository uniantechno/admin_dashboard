
import { NextResponse } from "next/server"

export async function POST(request) {
  const res = NextResponse.redirect(new URL("/", request.url))
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return res
}


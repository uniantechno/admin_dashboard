export async function POST(req) {
  try {
    const body = await req.json()
    const { username, email, password, mobilenumber } = body

    if (!username || !email || !password || !mobilenumber) {
      return Response.json(
        { error: "Missing required fields: username, email, password, mobilenumber" },
        { status: 400 },
      )
    }

    const res = await fetch("https://tantratalk.in/astrology/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, mobilenumber }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return Response.json(
        { error: `Failed to create astrologer: ${res.statusText}`, details: errorText },
        { status: res.status },
      )
    }

    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.log("[v0] POST astrology error:", error.message)
    return Response.json({ error: "Failed to create astrologer", details: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const res = await fetch("https://tantratalk.in/astrology/allprofile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) {
      return Response.json({ error: `Failed to fetch astrologers: ${res.statusText}` }, { status: res.status })
    }

    const data = await res.json()
    return Response.json({ items: Array.isArray(data) ? data : data.data || [] })
  } catch (error) {
    console.log("[v0] GET astrology error:", error.message)
    return Response.json({ error: "Failed to fetch astrologers", details: error.message }, { status: 500 })
  }
}

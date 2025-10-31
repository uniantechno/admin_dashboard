export async function PUT(req, { params }) {
  try {
    const { id } = params
    const body = await req.json()

    if (!id) {
      return Response.json({ error: "Missing astrologer ID" }, { status: 400 })
    }

    const res = await fetch(`https://tantratalk.in/astrology/editprofile/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return Response.json(
        { error: `Failed to edit astrologer: ${res.statusText}`, details: errorText },
        { status: res.status },
      )
    }

    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.log("[v0] PUT astrology error:", error.message)
    return Response.json({ error: "Failed to edit astrologer", details: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params

    if (!id) {
      return Response.json({ error: "Missing astrologer ID" }, { status: 400 })
    }

    const res = await fetch(`https://tantratalk.in/astrology/deleteprofile/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      const errorText = await res.text()
      return Response.json(
        { error: `Failed to delete astrologer: ${res.statusText}`, details: errorText },
        { status: res.status },
      )
    }

    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.log("[v0] DELETE astrology error:", error.message)
    return Response.json({ error: "Failed to delete astrologer", details: error.message }, { status: 500 })
  }
}

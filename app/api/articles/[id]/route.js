export async function GET(req, { params }) {
  try {
    const { id } = await params
    const res = await fetch(`https://tantratalk.in/admin/tips/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`)
    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.error("[v0] GET /api/articles/[id] error:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const formData = await req.formData()
    const res = await fetch(`https://tantratalk.in/admin/edittip/${id}`, {
      method: "PUT",
      body: formData,
    })
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`)
    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.error("[v0] PUT /api/articles/[id] error:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    const res = await fetch(`https://tantratalk.in/admin/tips/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`)
    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.error("[v0] DELETE /api/articles/[id] error:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

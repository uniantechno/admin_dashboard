export async function POST(req) {
  try {
    const formData = await req.formData()
    const res = await fetch("https://tantratalk.in/admin/addarticle", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`)
    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    console.error("[v0] POST /api/articles/add error:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

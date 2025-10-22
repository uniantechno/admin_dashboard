export async function PUT(req, context) {
  try {
    const { id } = await context.params // ✅ must await here
    const formData = await req.formData()

    const upstream = await fetch(`https://tantratalk.in/admin/updateproducts/${id}`, {
      method: "PUT",
      body: formData,
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    return Response.json(data, { status: upstream.status })
  } catch (err) {
    console.error("❌ PUT /api/products/[id] error:", err)
    return Response.json(
      { error: "Failed to update product", details: String(err) },
      { status: 500 }
    )
  }
}

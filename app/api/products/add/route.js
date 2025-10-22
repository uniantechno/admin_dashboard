export async function POST(req) {
  try {
    const formData = await req.formData()

    const upstream = await fetch("https://tantratalk.in/admin/addproducts", {
      method: "POST",
      body: formData, // keep multipart/mixed boundary
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
    return Response.json({ error: "Failed to add product", details: String(err) }, { status: 500 })
  }
}

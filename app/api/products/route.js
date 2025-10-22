export async function GET() {
  try {
    console.log("👉 Fetching from Tantra API...");
    const response = await fetch("https://tantratalk.in/admin/products", {
      cache: "no-store",
    });

    console.log("✅ Response status:", response.status, response.statusText);

    const text = await response.text();
    console.log("🧾 Raw response (first 400 chars):", text.slice(0, 400));

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON parse failed:", err.message);
      return Response.json(
        { items: [], error: "Invalid JSON from backend" },
        { status: 500 }
      );
    }

    // Extract items
    let items = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.data)) items = data.data;
    else if (Array.isArray(data?.products)) items = data.products;
    else if (Array.isArray(data?.data?.products)) items = data.data.products;
    else {
      const firstArray = Object.values(data).find(Array.isArray);
      if (Array.isArray(firstArray)) items = firstArray;
    }

    console.log("✅ Extracted", items.length, "products");

    return Response.json({ items }, { status: 200 });
  } catch (err) {
    console.error("🔥 API /api/products error:", err);
    return Response.json(
      { items: [], error: err.message },
      { status: 500 }
    );
  }
}

import axios from "axios";

export async function GET() {
  try {
    const { default: axios } = await import("axios");
    const axiosRes = await axios.get("https://tantratalk.in/admin/tips", {
      headers: { "Cache-Control": "no-store" },
    });
    const res = {
      ok: axiosRes.status >= 200 && axiosRes.status < 300,
      status: axiosRes.status,
      json: async () => axiosRes.data,
    };
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`)
    const data = await res.json()
    return Response.json({ items: Array.isArray(data) ? data : data.data || data.tips || [] })
  } catch (error) {
    console.error("[v0] GET /api/articles error:", error.message)
    return Response.json({ items: [], error: error.message }, { status: 500 })
  }
}

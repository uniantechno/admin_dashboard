import Link from "next/link"
import axios from "axios"

/* ------------------ helpers ------------------ */
function normalizeLangField(field) {
  if (!field) return {}

  // old data (string)
  if (typeof field === "string") {
    return { en: field }
  }

  // new data (object)
  return field
}

const LANG_LABELS = {
  en: "English",
  ta: "தமிழ்",
  te: "తెలుగు",
  hi: "हिन्दी",
  ml: "മലയാളം",
  ka: "ಕನ್ನಡ",
}

/* ------------------ API ------------------ */
async function getPooja(id) {
  const url = `http://localhost:5000/admin/pooja/${id}`

  try {
    const res = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    })

    const payload = res.data ?? null
    const data = payload?.data ?? payload ?? null
    const item = Array.isArray(data) ? data[0] : data

    return { ok: true, status: res.status, item }
  } catch (error) {
    return {
      ok: false,
      status: error?.response?.status || 500,
      item: null,
    }
  }
}

/* ------------------ PAGE ------------------ */
export default async function PoojaDetailsPage({ params }) {
  const { id } = params

  const { ok, status, item } = await getPooja(id)

  if (!ok) {
    return (
      <main className="container mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pooja Details</h1>
          <Link href="/pooja" className="border px-4 py-2 rounded-md text-sm">
            Back to Pooja
          </Link>
        </header>

        <div className="border rounded-lg p-6 text-red-500">
          Failed to load pooja details. Status: {status}
        </div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="container mx-auto p-6">
        <div className="border rounded-lg p-6">
          No details found.
        </div>
      </main>
    )
  }

  /* ------------------ NORMALIZE ------------------ */
  const titleObj = normalizeLangField(item.title)
  const descObj = normalizeLangField(item.description)

  const amount = item.amount ?? null
  const demoVideo = item.demoVideo ?? null
  const paidVideo = item.paidVideo ?? null

  /* ------------------ UI ------------------ */
  return (
    <main className="container mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {titleObj.en || Object.values(titleObj)[0] || "Untitled Pooja"}
        </h1>

        <Link href="/pooja" className="border px-4 py-2 rounded-md text-sm">
          Back to Pooja
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Description</h2>

            <div className="mt-4 space-y-4">
              {Object.entries(descObj).map(([lang, text]) => (
                <div key={lang} className="border rounded-md p-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    {LANG_LABELS[lang] || lang.toUpperCase()}
                    
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">Amount</div>
            <div className="text-lg font-medium">
              {amount ? `₹ ${amount}` : "—"}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="border rounded-lg p-4">
          {demoVideo && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Demo Video</h3>
              <video controls className="w-full rounded-md">
                <source src={demoVideo} type="video/mp4" />
              </video>
            </div>
          )}

          {paidVideo && (
            <div>
              <h3 className="font-semibold mb-2">Paid Video</h3>
              <video controls className="w-full rounded-md">
                <source src={paidVideo} type="video/mp4" />
              </video>
            </div>
          )}

          {!demoVideo && !paidVideo && (
            <div className="h-64 flex items-center justify-center bg-muted rounded-md">
              No Videos
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

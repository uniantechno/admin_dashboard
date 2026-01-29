import Link from "next/link"
import { Button } from "@/components/ui/button"
import { config } from "@/config"

const LANGS = [
  { key: "en", label: "English" },
  { key: "ta", label: "Tamil" },
  { key: "te", label: "Telugu" },
  { key: "hi", label: "Hindi" },
  { key: "ml", label: "Malayalam" },
  { key: "ka", label: "Kannada" },
]


async function getRemedy(id) {
    try {
        const url = `${config.adminUrl}/remedies/${id}`
        console.log("[DEBUG] Fetching remedy from:", url)

        const res = await fetch(url, { cache: "no-store" })
        const json = await res.json()

        console.log("[DEBUG] Response status:", res.status)
        console.log("[DEBUG] Response body:", json)

        if (!res.ok) throw new Error("Failed to fetch remedy")

        // Try different response structures
        const remedy = json.data || json.remedy || json
        console.log("[DEBUG] Extracted remedy:", remedy)

        return remedy || null
    } catch (error) {
        console.error("[DEBUG] getRemedy error:", error.message)
        return null
    }
}

export default async function RemedyDetailsPage({ params }) {
    const { id } = await params
    console.log("[DEBUG] Page loaded with id:", id)
    const remedy = await getRemedy(id)

    if (!remedy) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">Remedy not found</p>
                <p className="text-gray-600 text-sm mb-4">ID: {id}</p>
                <Link href="/remedy">
                    <Button>Back to Remedies</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
  {remedy.coverImage && (
    <img
      src={remedy.coverImage}
      alt="Remedy"
      className="w-full h-96 object-cover rounded-lg mb-8"
    />
  )}

  {LANGS.map(({ key, label }) => {
    const title = remedy.category?.[key]
    const desc = remedy.description?.[key]

    if (!title && !desc) return null

    return (
      <div key={key} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{label}</h2>

        {title && (
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
        )}

        {desc && (
          <p className="text-gray-600 whitespace-pre-wrap">
            {desc}
          </p>
        )}
      </div>
    )
  })}

  <Link href="/remedy">
    <Button>Back to Remedies</Button>
  </Link>
</div>

    )
}

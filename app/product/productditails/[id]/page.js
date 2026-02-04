import Link from "next/link"

/* ----------------------------------
   CONFIG
---------------------------------- */

const LANGS = [
  { key: "ta", label: "Tamil" },
  { key: "en", label: "English" },
  { key: "te", label: "Telugu" },
  { key: "hi", label: "Hindi" },
  { key: "ml", label: "Malayalam" },
  { key: "ka", label: "Kannada" },
]

const getLangValue = (obj, lang) => {
  if (!obj || typeof obj !== "object") return "—"
  return obj?.[lang] || "—"
}

/* ----------------------------------
   FETCH
---------------------------------- */

async function getProductDetails(id) {
  const url = `https://tantratalk.in/admin/products-details/${id}`
  const res = await fetch(url, { cache: "no-store" })

  let payload = null
  try {
    payload = await res.json()
  } catch {}

  const data = payload?.data ?? payload ?? null
  const item = Array.isArray(data) ? data[0] : data

  return {
    ok: res.ok,
    status: res.status,
    item,
  }
}

/* ----------------------------------
   PAGE
---------------------------------- */

export default async function ProductDetailsPage({ params }) {
  const { id } = await params
  const { ok, status, item } = await getProductDetails(id)

  /* ---------- ERROR STATES ---------- */

  if (!ok || !item) {
    return (
      <main className="container mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Product Details</h1>
          <Link href="/product" className="rounded-md border px-4 py-2 text-sm">
            Back to Products
          </Link>
        </header>

        <div className="rounded-lg border p-6">
          <p className="text-destructive">
            Failed to load product details. Status: {status}
          </p>
        </div>
      </main>
    )
  }

  /* ---------- BASIC FIELDS ---------- */

  const image =
    item.imageUrl ?? item.image ?? item.thumbnail ?? null

  const price = item.price ?? item.cost ?? null
  const stock = item.stock ?? item.quantity ?? null

  /* ----------------------------------
     RENDER
  ---------------------------------- */

  return (
    <main className="container mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">
          {getLangValue(item.name, "en")}
        </h1>
        <Link
          href="/product"
          className="rounded-md border px-4 py-2 text-sm"
        >
          Back to Products
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* IMAGE */}
        <div className="rounded-lg border p-4">
          {image ? (
            <img
              src={image}
              alt="Product image"
              className="w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-muted text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="rounded-lg border p-6 flex flex-col gap-6">
          {/* PRICE + STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="mt-1 text-lg font-medium">
                {price != null ? `₹ ${price}` : "—"}
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Stock</div>
              <div className="mt-1 text-lg font-medium">
                {stock != null ? stock : "—"}
              </div>
            </div>
          </div>

          {/* 🌍 ALL LANG CONTENT */}
          <div className="space-y-6">
            {LANGS.map(({ key, label }) => (
              <div key={key} className="rounded-md border p-4">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  {label}
                </h3>

                <div className="mt-3 space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Title ({key})
                    </div>
                    <div className="font-medium">
                      {getLangValue(item.name, key)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">
                      Description ({key})
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {getLangValue(item.description, key)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            Product ID: <span className="font-mono">{id}</span>
          </div>
        </div>
      </section>
    </main>
  )
}

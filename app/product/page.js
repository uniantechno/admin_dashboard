import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getProducts() {
  const res = await fetch("https://tantratalk.in/apiV1/backend/products", {
    // Avoid caching so admin sees latest products
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()

  // Normalize various potential shapes: [], {data: []}, {products: []}
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.products)
        ? data.products
        : []

  return items
}

export default async function ProductPage() {
  let products = []
  try {
    products = await getProducts()
  } catch (err) {
    // Render a simple error state
    return (
      <main className="p-6 bg-background text-foreground">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-pretty">Products</h1>
          <Button asChild>
            <Link href="/product/create">+ Create</Link>
          </Button>
        </header>
        <div className="rounded-md border border-border p-4">
          <p className="text-sm">Failed to load products. Please try again.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 bg-background text-foreground">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} item{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild>
          <Link href="/product/create">+ Create</Link>
        </Button>
      </header>

      {products.length === 0 ? (
        <div className="rounded-md border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Product list">
          {products.map((p, idx) => {
            const title = p?.title || p?.name || p?.productName || `Product #${idx + 1}`
            const price = p?.price ?? p?.selling_price ?? p?.mrp ?? p?.amount ?? null
            const image = p?.imageUrl || p?.thumbnail || "/product-card.jpg"
           

            return (
              <article
                key={p?.id ?? p?._id ?? idx}
                className="rounded-lg border border-border overflow-hidden bg-card text-card-foreground"
              >
                <div className="aspect-[3/2] bg-muted">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${title} image`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-medium truncate">{title}</h2>
                    {price != null && <p className="text-sm text-muted-foreground mt-1">₹{price}</p>}
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}

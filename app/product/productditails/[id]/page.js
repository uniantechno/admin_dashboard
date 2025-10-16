import Link from "next/link"

async function getProductDetails(id) {
  const url = `https://tantratalk.in/apiV1/backend/products-details/${id}`
  const res = await fetch(url, { cache: "no-store" })

  let payload = null
  try {
    payload = await res.json()
  } catch (e) {
    // ignore json parse errors
  }

  const data = payload?.data ?? payload ?? null
  const item = Array.isArray(data) ? data[0] : data

  return {
    ok: res.ok,
    status: res.status,
    item,
  }
}

export default async function ProductDetailsPage({ params }) {
  // ✅ Await params (required in Next.js 15+)
  const { id } = await params

  const { ok, status, item } = await getProductDetails(id)

  if (!ok) {
    return (
      <main className="container mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground text-balance">Product Details</h1>
          <Link
            href="/product"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Back to Products
          </Link>
        </header>

        <div className="rounded-lg border border-border p-6">
          <p className="text-destructive">Failed to load product details. Status: {status}</p>
          <p className="text-muted-foreground mt-2">Please try again or go back to the products list.</p>
        </div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="container mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground text-balance">Product Details</h1>
          <Link
            href="/product"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Back to Products
          </Link>
        </header>

        <div className="rounded-lg border border-border p-6">
          <p className="text-muted-foreground">No details found for this product.</p>
        </div>
      </main>
    )
  }

  const name = item.name ?? item.title ?? "Untitled Product"
  const description = item.description ?? item.details ?? "No description available."
  const price = item.price ?? item.cost ?? null
  const stock = item.stock ?? item.quantity ?? null
  const image = item.imageUrl ?? item.image ?? item.thumbnail ?? null

  return (
    <main className="container mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground text-balance">{name}</h1>
        <Link
          href="/product"
          className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          aria-label="Back to Products"
        >
          Back to Products
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          {image ? (
            <img
              src={image || "/placeholder.svg"}
              alt={`${name} image`}
              className="h-auto w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Overview</h2>
            <p className="mt-2 text-pretty leading-relaxed text-foreground/80">{description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-border p-4">
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="mt-1 text-lg font-medium text-foreground">{price != null ? `₹ ${price}` : "—"}</div>
            </div>

            <div className="rounded-md border border-border p-4">
              <div className="text-sm text-muted-foreground">Stock</div>
              <div className="mt-1 text-lg font-medium text-foreground">{stock != null ? stock : "—"}</div>
            </div>
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            Product ID: <span className="font-mono">{id}</span>
          </div>
        </div>
      </section>
    </main>
  )
}

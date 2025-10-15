import { Button } from "@/components/ui/button"
import ProductFormDialog from "./_components/product-form-dialog"
import  {config}  from "../../config"

async function getProducts() {
  const baseURL = config.baseUrl || "http://localhost:3000"
  console.log("Base URL:", baseURL)
  const url = `${baseURL}/products`
  console.log("Fetching from:", url)

  const res = await fetch(url, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  let items = Array.isArray(data?.items) ? data.items : []

  if (items.length === 0) {
    const fallback = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
          ? data
          : []
    if (fallback.length) items = fallback
  }

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
          <ProductFormDialog mode="create" />
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
        <ProductFormDialog mode="create" />
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
            const stock = p?.stock ?? p?.inStock ?? p?.quantity ?? null
            const id = p?.id ?? p?._id ?? idx

            return (
              <article
                key={id}
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
                    {stock != null && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <ProductFormDialog mode="edit" productId={id} initial={p} asIcon />
                    <Button variant="ghost" size="icon" aria-label="Delete product">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 11v6M14 11v6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
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

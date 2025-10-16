"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ProductFormDialog from "./_components/product-form-dialog"
import { config } from "@/config"
import axios from "axios"
import Link from "next/link"

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    const baseURL = config.baseUrl || "http://localhost:3000"
    const url = `${baseURL}/products` // ✅ should point to your API route
    console.log("Fetching products from:", url)

    try {
      const response = await axios.get(url)
      let items = Array.isArray(response.data?.items) ? response.data.items : []

      if (items.length === 0) {
        const fallback = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.products)
            ? response.data.products
            : Array.isArray(response.data)
              ? response.data
              : []

        if (fallback.length) items = fallback
      }

      setProducts(items)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

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

      {loading ? (
        <div className="rounded-md border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-border p-4 text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-md border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <section
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Product list"
        >
          {products.map((p, idx) => {
            const title = p?.title || p?.name || p?.productName || `Product #${idx + 1}` // ✅ fixed
            const price = p?.price ?? p?.selling_price ?? p?.mrp ?? p?.amount ?? null
            const image = p?.imageUrl || p?.thumbnail || "/product-card.jpg"
            const stock = p?.stock ?? p?.inStock ?? p?.quantity ?? null
            const id = p?.id ?? p?._id ?? idx

            const handleDelete = async () => {
              if (!window.confirm("Are you sure you want to delete this product?")) return;
              try {
              setLoading(true);
              setError(null);
              const baseURL = config.baseUrl || "http://localhost:3000";
              await axios.delete(`${baseURL}/deleteproduct/${id}`);
              setProducts(prev => prev.filter(item => (item.id ?? item._id ?? idx) !== id));
              } catch (err) {
              setError("Failed to delete product. Please try again.");
              } finally {
              setLoading(false);
              }
            };

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
                {price != null && (
                  <p className="text-sm text-muted-foreground mt-1">₹{price}</p>
                )}
                {stock != null && (
                  <p className="text-sm text-muted-foreground mt-1">
                  {stock > 0 ? `${stock} in stock` : "Out of stock"}
                  </p>
                )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                <Button asChild size="sm" variant="secondary" aria-label={`View ${title}`}>
                      <Link href={`/product/productditails/${id}`}>View</Link>
                    </Button>
                <ProductFormDialog mode="edit" productId={id} initial={p} asIcon />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete product"
                  onClick={handleDelete}
                >
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

export default ProductPage

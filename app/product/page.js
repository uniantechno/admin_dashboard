"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import ProductFormDialog from "./_components/product-form-dialog"
import { config } from "@/config"
import axios from "axios"
import Link from "next/link"

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(0) // 🔁 trigger re-fetch when changed

  // ✅ Stable fetch function (with proper error handling)
  const fetchProducts = useCallback(async () => {
    const baseURL = config.adminUrl || "http://localhost:3000"
    const url = `${baseURL}/products`
    console.log("Fetching products from:", url)

    try {
      setLoading(true)
      const response = await axios.get(url, { headers: { "Cache-Control": "no-store" } })

      let items = Array.isArray(response.data?.items)
        ? response.data.items
        : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.products)
            ? response.data.products
            : Array.isArray(response.data)
              ? response.data
              : []

      setProducts(items)
      setError(null)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Initial + refresh-triggered fetch
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refresh])

  // ✅ Delete product and refresh list instantly
  const handleDelete = async (id, idx) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      setLoading(true)
      setError(null)
      const baseURL = config.adminUrl || "http://localhost:3000"
      await axios.delete(`${baseURL}/deleteproduct/${id}`)
      setProducts((prev) => prev.filter((item) => (item.id ?? item._id ?? idx) !== id))
      setRefresh((r) => r + 1) // 🔁 force re-fetch from server
    } catch (err) {
      console.error("Delete error:", err)
      setError("Failed to delete product. Please try again.")
    } finally {
      setLoading(false)
    }
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
        {/* ✅ Pass refresh trigger to ProductFormDialog */}
        <div className="flex gap-2">
          <ProductFormDialog mode="create" onSuccess={() => setRefresh((r) => r + 1)} />
          <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>
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

                    {/* ✅ Refresh page after edit success */}
                    <ProductFormDialog
                      mode="edit"
                      productId={id}
                      initial={p}
                      asIcon
                      onSuccess={() => setRefresh((r) => r + 1)}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete product"
                      onClick={() => handleDelete(id, idx)}
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

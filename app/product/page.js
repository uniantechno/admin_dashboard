"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import ProductFormDialog from "./_components/product-form-dialog"
import { config } from "@/config"
import axios from "axios"
import Link from "next/link"

/* ----------------------------------
   CONFIG
---------------------------------- */

const LANG = "en" // later context / redux / cookie la irundhu edukalaam

const getLangValue = (val, lang = "en") => {
  if (!val) return ""
  if (typeof val === "object") return val?.[lang] || ""
  return val
}

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(0)

  /* ----------------------------------
     FETCH PRODUCTS
  ---------------------------------- */

  const fetchProducts = useCallback(async () => {
    const baseURL = config.adminUrl || "http://localhost:3000"
    const url = `${baseURL}/products`

    try {
      setLoading(true)
      setError(null)

      const res = await axios.get(url, {
        headers: { "Cache-Control": "no-store" },
      })

      const items =
        Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.items)
            ? res.data.items
            : Array.isArray(res.data?.products)
              ? res.data.products
              : Array.isArray(res.data)
                ? res.data
                : []

      setProducts(items)
    } catch (err) {
      console.error("Fetch products failed:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refresh])

  /* ----------------------------------
     DELETE
  ---------------------------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      setLoading(true)
      const baseURL = config.adminUrl || "http://localhost:3000"
      await axios.delete(`${baseURL}/deleteproduct/${id}`)
      setRefresh((r) => r + 1)
    } catch (err) {
      console.error("Delete error:", err)
      setError("Failed to delete product.")
    } finally {
      setLoading(false)
    }
  }

  /* ----------------------------------
     RENDER
  ---------------------------------- */

  return (
    <main className="p-6 bg-background text-foreground">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} item{products.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex gap-2">
          <ProductFormDialog
            mode="create"
            onSuccess={() => setRefresh((r) => r + 1)}
          />
          <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      ) : error ? (
        <div className="rounded-md border p-4 text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-sm text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, idx) => {
            const id = p?._id ?? idx

            const title =
              getLangValue(p?.name, LANG) ||
              getLangValue(p?.title, LANG) ||
              `Product #${idx + 1}`

            const price =
              p?.price ??
              p?.selling_price ??
              p?.mrp ??
              p?.amount ??
              null

            const image =
              p?.imageUrl || p?.thumbnail || "/product-card.jpg"

            const stock =
              p?.stock ?? p?.inStock ?? p?.quantity ?? null

            return (
              <article
                key={id}
                className="rounded-lg border overflow-hidden bg-card"
              >
                <div className="aspect-[3/2] bg-muted">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-medium truncate">{title}</h2>

                    {price != null && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ₹{price}
                      </p>
                    )}

                    {stock != null && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/product/productditails/${id}`}>View</Link>
                    </Button>

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
                      onClick={() => handleDelete(id)}
                    >
                      🗑
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

"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { config } from "../../../config"

function normalizeInitial(p = {}) {
  const name = p.name ?? p.title ?? p.productName ?? ""
  const description = p.description ?? p.desc ?? p.details ?? ""
  const price = p.price ?? p.selling_price ?? p.mrp ?? p.amount ?? ""
  const stock = p.stock ?? p.inStock ?? p.quantity ?? ""
  return { name, description, price, stock }
}

export default function ProductFormDialog({
  mode = "create",
  productId,
  initial,
  asIcon = false,
  className,
  onSuccess, // ✅ callback for instant UI update
}) {
  const [open, setOpen] = React.useState(false)
  const [imageFile, setImageFile] = React.useState(null)
  const [form, setForm] = React.useState(normalizeInitial(initial))
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (initial) setForm(normalizeInitial(initial))
  }, [initial])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const fd = new FormData()
      fd.set("name", String(form.name || ""))
      fd.set("description", String(form.description || ""))
      fd.set("price", String(form.price || ""))
      fd.set("stock", String(form.stock || ""))
      if (imageFile) fd.set("image", imageFile)

      const base = config.adminUrl || "http://localhost:3000"
      const url =
        mode === "create"
          ? `${base}/addproduct`
          : `${base}/updateproduct/${productId}`
      const method = mode === "create" ? "POST" : "PUT"

      const res = await fetch(url, { method, body: fd })
      const data = await res.json()

      if (!res.ok || data?.success === false) throw new Error(data?.message || "Request failed")

      onSuccess?.(data.data || form) // ✅ trigger UI update instantly
      setOpen(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const Trigger = (
    <Button
      type="button"
      variant={mode === "create" ? "default" : "ghost"}
      size={asIcon ? "icon" : "default"}
      className={cn(className)}
    >
      {mode === "create" ? (
        "+ Create"
      ) : asIcon ? (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M16.475 5.475a2.121 2.121 0 1 1 3 3L7.5 20.45l-4 1 1-4 12.975-12.975Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        "Edit"
      )}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Product" : "Edit Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the product"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Upload image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

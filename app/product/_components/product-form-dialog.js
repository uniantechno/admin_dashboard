"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { config } from "../../../config"

/* ----------------------------------
   CONSTANTS
---------------------------------- */

const LANGS = ["en", "ta", "te", "hi", "ml", "ka"]

const emptyLang = () => ({
  en: "",
  ta: "",
  te: "",
  hi: "",
  ml: "",
  ka: "",
})

/* ----------------------------------
   NORMALIZE INITIAL DATA
---------------------------------- */

function normalizeInitial(p = {}) {
  return {
    name: { ...emptyLang(), ...(p.name || {}) },
    description: { ...emptyLang(), ...(p.description || {}) },
    price: p.price ?? "",
    stock: p.stock ?? "",
  }
}

/* ----------------------------------
   COMPONENT
---------------------------------- */

export default function ProductFormDialog({
  mode = "create",
  productId,
  initial,
  asIcon = false,
  className,
  onSuccess,
}) {
  const [open, setOpen] = React.useState(false)
  const [imageFile, setImageFile] = React.useState(null)
  const [form, setForm] = React.useState(normalizeInitial(initial))
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (initial) setForm(normalizeInitial(initial))
  }, [initial])

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const fd = new FormData()

      // 🔥 MULTI LANG FIELDS
     fd.append("name", JSON.stringify(form.name));
     fd.append("description", JSON.stringify(form.description));
     fd.append("price", form.price);
     fd.append("stock", form.stock);


      if (imageFile) fd.set("image", imageFile)

      const base = config.adminUrl || "http://localhost:5000/admin"
      const url =
        mode === "create"
          ? `${base}/addproduct`
          : `${base}/updateproduct/${productId}`

      const method = mode === "create" ? "POST" : "PUT"

      const res = await fetch(url, { method, body: fd })
      const data = await res.json()

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Request failed")
      }

      onSuccess?.(data.product || data.data)
      setOpen(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ----------------------------------
     TRIGGER BUTTON
  ---------------------------------- */

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
        <svg width="20" height="20" viewBox="0 0 24 24">
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

  /* ----------------------------------
     RENDER
  ---------------------------------- */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[75vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 overflow-y-auto pr-2 scrollbar-thin">
          {/* 🌍 MULTI LANG BLOCKS */}
          {LANGS.map((lang) => (
            <div key={lang} className="rounded-md border p-4 space-y-3">
              <p className="text-sm font-semibold uppercase text-muted-foreground">
                {lang}
              </p>

              {/* NAME */}
              <div className="grid gap-1">
                <Label>Name ({lang})</Label>
                <Input
                  value={form.name[lang]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: { ...f.name, [lang]: e.target.value },
                    }))
                  }
                  required={lang === "en"}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="grid gap-1">
                <Label>Description ({lang})</Label>
                <Textarea
                  rows={3}
                  value={form.description[lang]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: {
                        ...f.description,
                        [lang]: e.target.value,
                      },
                    }))
                  }
                  required={lang === "en"}
                />
              </div>
            </div>
          ))}

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-1">
              <Label>Stock</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* IMAGE */}
          <div className="grid gap-1">
            <Label>Product Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { config } from "../../../config"

export function ArticleFormDialog({ open, onOpenChange, article = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: null,
  })

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        description: article.description || "",
        coverImage: null,
      })
    } else {
      setFormData({ title: "", description: "", coverImage: null })
    }
  }, [article])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "coverImage") {
      setFormData((prev) => ({ ...prev, coverImage: files?.[0] || null }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("description", formData.description)
      if (formData.coverImage) form.append("coverImage", formData.coverImage)

      const baseURL = config.baseUrl || "http://localhost:3000"
      const endpoint = article
        ? `${baseURL}/edittip/${article._id || article.id}`
        : `${baseURL}/addtip`
      const method = article ? "PUT" : "POST"

      const res = await fetch(endpoint, { method, body: form })
      const result = await res.json()

      if (!res.ok || !result.success) throw new Error(result.message || "Save failed")

      // ✅ Return the new/updated article to parent
      onSuccess?.(result.data)
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{article ? "Edit Article" : "Create Article"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <Input type="file" name="coverImage" accept="image/*" onChange={handleChange} />
            {article?.coverImage && (
              <img
                src={`${config.articleUrl || "http://localhost:3000"}/uploads/${article.coverImage}`}
                alt="cover"
                className="mt-2 w-24 h-24 object-cover rounded border"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArticleFormDialog } from "./_components/article-form-dialog"
import { config } from "@/config"

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  console.log("baseURL:", config.adminUrl);

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${config.adminUrl}/tips`, { method: "GET" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch articles")
      setArticles(data.data || data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`${config.adminUrl}/tips/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setArticles((prev) => prev.filter((a) => (a._id || a.id) !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEdit = (article) => {
    setEditingArticle(article)
    setDialogOpen(true)
  }

  const handleDialogClose = (open) => {
    setDialogOpen(open)
    if (!open) setEditingArticle(null)
  }

  const handleFormSuccess = (newArticle) => {
    if (editingArticle) {
      // ✅ Update existing article instantly
      setArticles((prev) =>
        prev.map((a) =>
          (a._id || a.id) === (editingArticle._id || editingArticle.id) ? newArticle : a
        )
      )
    } else {
      // ✅ Add newly created article instantly
      setArticles((prev) => [newArticle, ...prev])
    }
    setEditingArticle(null)
  }

  if (loading) return <div className="p-8 text-center">Loading articles...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button onClick={() => setDialogOpen(true)}>+ Create</Button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{error}</div>}

      {articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No articles yet</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const id = article._id || article.id
            return (
              <Card key={id}>
                {article.coverImage && (
                  <img
                    src={
                      article.coverImage.startsWith("http")
                        ? article.coverImage
                        : `/uploads/${article.coverImage}`
                    }
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  <div className="flex gap-2">
                    <Link href={`/articles/ditails/${id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ArticleFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        article={editingArticle}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

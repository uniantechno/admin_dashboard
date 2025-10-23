import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getArticle(id) {
  try {
    const res = await fetch(`https://tantratalk.in/admin/tips/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch article")
    return await res.json()
  } catch (error) {
    console.error("[v0] getArticle error:", error.message)
    return null
  }
}

export default async function ArticleDetailsPage({ params }) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Article not found</p>
        <Link href="/articles">
          <Button>Back to Articles</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {article.coverImage && (
        <img
          src={article.coverImage || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 whitespace-pre-wrap mb-8">{article.description}</p>
      <Link href="/articles">
        <Button>Back to Articles</Button>
      </Link>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function LogoutButton() {
  // server component form approach to avoid client JS
  return (
    <form action="/api/logout" method="POST">
      <Button type="submit" variant="secondary">
        Logout
      </Button>
    </form>
  )
}

export default function AdminDashboard() {
  return (
    <main className="min-h-screen p-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold text-balance">Admin Dashboard</h1>
        {/* @ts-expect-error Server Component form */}
        <LogoutButton />
      </header>

      <section className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"Manage your product list and details."}</p>
            <Button asChild>
              <Link href="/product">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pooja</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"Manage pooja list and details."}</p>
            <Button asChild>
              <Link href="/pooja">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Books</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"Manage books list and details."}</p>
            <Button asChild>
              <Link href="/books">Open</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Articles & Tips</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"Manage articles and tips list and details."}</p>
            <Button asChild>
              <Link href="/articles">Open</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Astrologers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"Manage astrologers list and details."}</p>
            <Button asChild>
              <Link href="/astrology">Open</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

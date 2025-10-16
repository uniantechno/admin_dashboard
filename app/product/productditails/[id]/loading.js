export default function Loading() {
  return (
    <main className="container mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="h-6 w-48 rounded bg-muted" />
        <div className="h-9 w-36 rounded bg-muted" />
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-64 w-full rounded-lg bg-muted" />
        <div className="rounded-lg border border-border p-6">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="mt-3 h-20 w-full rounded bg-muted" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="h-16 w-full rounded bg-muted" />
            <div className="h-16 w-full rounded bg-muted" />
          </div>
        </div>
      </section>
    </main>
  )
}

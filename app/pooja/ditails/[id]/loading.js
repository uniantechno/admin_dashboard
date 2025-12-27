export default function Loading() {
    return (
        <main className="container mx-auto p-6">
            <header className="mb-6 flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border p-6 flex flex-col gap-4">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-16 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="rounded-lg border border-border p-4">
                    <div className="h-64 bg-gray-200 rounded-md animate-pulse" />
                </div>
            </section>
        </main>
    )
}
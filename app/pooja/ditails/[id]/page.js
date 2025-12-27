import Link from "next/link"
import axios from "axios"


async function getPooja(id) {
  const url = `https://tantratalk.in/admin/pooja/${id}`;

  try {
    const res = await axios.get(url, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    const payload = res.data ?? null;
    const data = payload?.data ?? payload ?? null;
    const item = Array.isArray(data) ? data[0] : data;
    console.log("Fetched pooja item:", item);

    return {
      ok: true,
      status: res.status,
      item,
    };
  } catch (error) {
    return {
      ok: false,
      status: error?.response?.status || 500,
      item: null,
    };
  }
}


export default async function PoojaDetailsPage({ params }) {
    // ✅ Await params (required in Next.js 15+)
    const { id } = await params

    const { ok, status, item } = await getPooja(id)

    if (!ok) {
        return (
            <main className="container mx-auto p-6">
                <header className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-foreground text-balance">Pooja Details</h1>
                    <Link
                        href="/pooja"
                        className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                        Back to Pooja
                    </Link>
                </header>

                <div className="rounded-lg border border-border p-6">
                    <p className="text-destructive">Failed to load pooja details. Status: {status}</p>
                    <p className="text-muted-foreground mt-2">Please try again or go back to the pooja list.</p>
                </div>
            </main>
        )
    }

    if (!item) {
        return (
            <main className="container mx-auto p-6">
                <header className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-foreground text-balance">Pooja Details</h1>
                    <Link
                        href="/pooja"
                        className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                        Back to Pooja
                    </Link>
                </header>

                <div className="rounded-lg border border-border p-6">
                    <p className="text-muted-foreground">No details found for this pooja.</p>
                </div>
            </main>
        )
    }

    const title = item.title ?? "Untitled Pooja"
    const description = item.description ?? "No description available."
    const amount = item.amount ?? null
    const demoVideo = item.demoVideo ?? null
    const paidVideo = item.paidVideo ?? null

    return (
        <main className="container mx-auto p-6">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground text-balance">{title}</h1>
                <Link
                    href="/pooja"
                    className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    aria-label="Back to Pooja"
                >
                    Back to Pooja
                </Link>
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border p-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Description</h2>
                        <p className="mt-2 text-pretty leading-relaxed text-foreground/80">{description}</p>
                    </div>

                    <div className="rounded-md border border-border p-4">
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="mt-1 text-lg font-medium text-foreground">{amount != null ? `₹ ${amount}` : "—"}</div>
                    </div>

                    {/* <div className="pt-2 text-sm text-muted-foreground">
                        Pooja ID: <span className="font-mono">{id}</span>
                    </div> */}
                </div>

                <div className="rounded-lg border border-border p-4">
                    {demoVideo && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Demo Video</h3>
                            <video controls className="w-full rounded-md">
                                <source src={demoVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                    {paidVideo && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Paid Video</h3>
                            <video controls className="w-full rounded-md">
                                <source src={paidVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                    {!demoVideo && !paidVideo && (
                        <div className="flex h-64 w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
                            No Videos
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
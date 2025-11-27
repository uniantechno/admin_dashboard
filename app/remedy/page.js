// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { RemedyFormDialog } from "./_components/remedy-form-dialog"
// import { config } from "@/config"

// export default function RemedyPage() {
//     const [items, setItems] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState("")
//     const [dialogOpen, setDialogOpen] = useState(false)
//     const [editingItem, setEditingItem] = useState(null)

//     useEffect(() => {
//         fetchItems()
//     }, [])

//     const fetchItems = async () => {
//         try {
//             setLoading(true)
//             const res = await fetch(`${config.adminUrl}/remedies`, { method: "GET" })
//             const data = await res.json()
//             if (!res.ok) throw new Error(data.message || "Failed to fetch remedies")
//             setItems(data.data || data.items || [])
//         } catch (err) {
//             setError(err.message)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure?")) return
//         try {
//             const res = await fetch(`${config.adminUrl}/remedies/${id}`, { method: "DELETE" })
//             if (!res.ok) throw new Error("Failed to delete")
//             setItems((prev) => prev.filter((a) => (a._id || a.id) !== id))
//         } catch (err) {
//             alert(err.message)
//         }
//     }

//     const handleEdit = (item) => {
//         setEditingItem(item)
//         setDialogOpen(true)
//     }

//     const handleDialogClose = (open) => {
//         setDialogOpen(open)
//         if (!open) setEditingItem(null)
//     }

//     const handleFormSuccess = async () => {
//         // Fetch fresh data from server after successful create/edit
//         await fetchItems()
//         setEditingItem(null)
//     }

//     if (loading) return <div className="p-8 text-center">Loading remedies...</div>

//     return (
//         <div className="p-8">
//             <div className="flex items-center justify-between mb-8">
//                 <h1 className="text-3xl font-bold">Remedies</h1>
//                 <Button onClick={() => setDialogOpen(true)}>+ Create</Button>
//             </div>

//             {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{error}</div>}

//             {items.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500">No remedies yet</div>
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {items.map((item) => {
//                         const id = item._id || item.id
//                         return (
//                             <Card key={id}>
//                                 {item.coverImage && (
//                                     <img
//                                         src={item.coverImage.startsWith("http") ? item.coverImage : `/uploads/${item.coverImage}`}
//                                         alt={item.category}
//                                         className="w-full h-40 object-cover"
//                                     />
//                                 )}
//                                 <CardHeader>
//                                     <CardTitle>{item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-sm text-gray-600 mb-2">{item.description?.slice(0, 160)}{item.description?.length > 160 ? '...' : ''}</p>
//                                     <div className="flex gap-2">
//                                         <Link href={`/remedy/ditails/${id}`}>
//                                             <Button variant="outline" size="sm">View</Button>
//                                         </Link>
//                                         <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
//                                         <Button variant="destructive" size="sm" onClick={() => handleDelete(id)}>Delete</Button>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         )
//                     })}
//                 </div>
//             )}

//             <RemedyFormDialog
//                 open={dialogOpen}
//                 onOpenChange={handleDialogClose}
//                 remedy={editingItem}
//                 onSuccess={handleFormSuccess}
//             />
//         </div>
//     )
// }


"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RemedyFormDialog } from "./_components/remedy-form-dialog"
import { config } from "@/config"

export default function RemedyPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            setLoading(true)

            const res = await fetch(`${config.adminUrl}/remedies?ts=${Date.now()}`, {
                method: "GET",
                cache: "no-store"
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message || "Failed to fetch remedies")

            setItems(data.data || data.items || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return
        try {
            const res = await fetch(`${config.adminUrl}/remedies/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Delete failed")

            setItems((prev) => prev.filter((a) => (a._id || a.id) !== id))
        } catch (err) {
            alert(err.message)
        }
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setDialogOpen(true)
    }

    const handleFormSuccess = async () => {
        await fetchItems()
        setEditingItem(null)
    }

    if (loading) return <div className="p-8 text-center">Loading remedies...</div>

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Remedies</h1>
                <Button onClick={() => setDialogOpen(true)}>+ Create</Button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{error}</div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No remedies yet</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                        const id = item._id || item.id

                        return (
                            <Card key={id}>
                                {item.coverImage && (
                                    <img
                                        src={
                                            item.coverImage.startsWith("http")
                                                ? item.coverImage
                                                : `/uploads/${item.coverImage}`
                                        }
                                        className="w-full h-40 object-cover"
                                        alt={item.category}
                                    />
                                )}
                                <CardHeader>
                                    <CardTitle>
                                        {item.category?.charAt(0).toUpperCase() +
                                            item.category?.slice(1)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {item.description?.slice(0, 160)}
                                        {item.description?.length > 160 ? "..." : ""}
                                    </p>
                                    <div className="flex gap-2">
                                        <Link href={`/remedy/ditails/${id}`}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            <RemedyFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                remedy={editingItem}
                onSuccess={handleFormSuccess}
            />
        </div>
    )
}

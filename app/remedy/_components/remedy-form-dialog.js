// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { config } from "../../../config"

// export function RemedyFormDialog({ open, onOpenChange, remedy = null, onSuccess }) {
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState("")
//     const [success, setSuccess] = useState("")
//     const [formData, setFormData] = useState({
//         category: "",
//         description: "",
//         coverImage: null,
//     })

//     useEffect(() => {
//         if (open) {
//             if (remedy) {
//                 setFormData({
//                     category: remedy.category || "",
//                     description: remedy.description || "",
//                     coverImage: null,
//                 })
//             } else {
//                 setFormData({ category: "", description: "", coverImage: null })
//             }
//             setError("")
//             setSuccess("")
//         }
//     }, [open, remedy])

//     const handleChange = (e) => {
//         const { name, value, files } = e.target
//         if (name === "coverImage") {
//             setFormData((prev) => ({ ...prev, coverImage: files?.[0] || null }))
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }))
//         }
//     }

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//         const form = new FormData();
//         form.append("category", formData.category);
//         form.append("description", formData.description);
//         if (formData.coverImage) {
//             form.append("coverImage", formData.coverImage);
//         }

//         const baseURL = config.adminUrl || "http://localhost:3000";
//         const endpoint = remedy
//             ? `${baseURL}/editremedy/${remedy._id || remedy.id}`
//             : `${baseURL}/addremedy`;
//         const method = remedy ? "PUT" : "POST";

//         const res = await fetch(endpoint, { method, body: form });
//         const result = await res.json();

//         // FIX 1 → success check improved (covers all API types)
//         const isOK =
//             res.ok &&
//             (result.success === true ||
//                 result.status === "success" ||
//                 result.message?.toLowerCase()?.includes("success"));

//         if (!isOK) {
//             throw new Error(result.message || "Save failed");
//         }

//         // REFRESH parent list
//         await onSuccess?.();

//         // CLOSE the dialog
//         onOpenChange(false);

//         // CLEAR form after close
//         setFormData({
//             category: "",
//             description: "",
//             coverImage: null,
//         });

//         return;
//     } catch (err) {
//         setError(err.message);
//     } finally {
//         setLoading(false);
//     }
// };



//     const categories = [
//         "career",
//         "love",
//         "family",
//         "education",
//         "money",
//         "health",
//         "relationship",
//     ]

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>{remedy ? "Edit Remedy" : "Create Remedy"}</DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {error && <p className="text-sm text-red-500">{error}</p>}
//                     {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

//                     <div>
//                         <label className="block text-sm font-medium mb-1">Category</label>
//                         <select
//                             name="category"
//                             value={formData.category}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border rounded"
//                         >
//                             <option value="" disabled>
//                                 Select category
//                             </option>
//                             {categories.map((c) => (
//                                 <option key={c} value={c}>
//                                     {c.charAt(0).toUpperCase() + c.slice(1)}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium mb-1">Description</label>
//                         <Textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             placeholder="Enter description"
//                             rows={5}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium mb-1">Cover Image</label>
//                         <Input type="file" name="coverImage" accept="image/*" onChange={handleChange} />
//                         {remedy?.coverImage && (
//                             <img
//                                 src={
//                                     remedy.coverImage.startsWith("http")
//                                         ? remedy.coverImage
//                                         : `${config.adminUrl || "http://localhost:3000"}/uploads/${remedy.coverImage}`
//                                 }
//                                 alt="cover"
//                                 className="mt-2 w-24 h-24 object-cover rounded border"
//                             />
//                         )}
//                     </div>

//                     <div className="flex justify-end gap-2">
//                         <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={loading}>
//                             {loading ? "Saving..." : "Save"}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }



"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { config } from "../../../config"

export function RemedyFormDialog({ open, onOpenChange, remedy = null, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        category: "",
        description: "",
        coverImage: null,
    })

    useEffect(() => {
        if (open) {
            if (remedy) {
                setFormData({
                    category: remedy.category || "",
                    description: remedy.description || "",
                    coverImage: null,
                })
            } else {
                setFormData({ category: "", description: "", coverImage: null })
            }
            setError("")
        }
    }, [open, remedy])

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
            form.append("category", formData.category)
            form.append("description", formData.description)
            if (formData.coverImage) {
                form.append("coverImage", formData.coverImage)
            }

            const baseURL = config.adminUrl
            const endpoint = remedy
                ? `${baseURL}/editremedy/${remedy._id || remedy.id}`
                : `${baseURL}/addremedy`

            const method = remedy ? "PUT" : "POST"

            const res = await fetch(endpoint, { method, body: form })
            const result = await res.json()

            if (!res.ok || result.success === false) {
                throw new Error(result.message || "Failed to save")
            }

            // WAIT UNTIL LIST REFRESH COMPLETES
            await onSuccess()

            // Close modal only AFTER refresh
            onOpenChange(false)

            setFormData({
                category: "",
                description: "",
                coverImage: null,
            })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        "career",
        "love",
        "family",
        "education",
        "money",
        "health",
        "relationship",
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{remedy ? "Edit Remedy" : "Create Remedy"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="" disabled>Select category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            required
                            placeholder="Enter description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image</label>
                        <Input type="file" name="coverImage" accept="image/*" onChange={handleChange} />
                        {remedy?.coverImage && (
                            <img
                                src={
                                    remedy.coverImage.startsWith("http")
                                        ? remedy.coverImage
                                        : `${config.adminUrl}/uploads/${remedy.coverImage}`
                                }
                                alt="cover"
                                className="mt-2 w-24 h-24 object-cover rounded"
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

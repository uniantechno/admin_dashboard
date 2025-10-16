"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { config } from "../../../config"
import axios from "axios" // ✅ New import

function normalizeInitial(p = {}) {
    return {
        title: p.title || "",
        description: p.description || "",
        price: p.price || "",
        // coverImage: p.coverImage || "",
        // pdffile: p.pdffile || "",
    };
}


const BookFormDialog = ({ mode = "create", bookId, initial, asIcon = false, className, onSuccess }) => {
    console.log(bookId,"bookIdidiaog")
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [pending, startTransition] = React.useTransition()
    const [imageFile, setImageFile] = React.useState(null)
    const [pdfFile, setPdfFile] = React.useState(null)

    const init = normalizeInitial(initial)
    const [form, setForm] = React.useState(init)

    React.useEffect(() => {
        setForm(normalizeInitial(initial))
    }, [initial])

    const onSubmit = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.set("title", String(form.title || ""))
        fd.set("description", String(form.description || ""))
        fd.set("price", String(form.price || ""))
        if (imageFile) fd.set("coverImage", imageFile)
        if (pdfFile) fd.set("pdffile", pdfFile)
        console.log(form.title, form.description, form.price, imageFile, pdfFile, "jjjjjjjjj");
        const url =
            mode === "create"
                ? `${config.baseUrl}/addbook`
                : `${config.baseUrl}/updatebook/${bookId}`

        try {
            if (mode === "create") {
                await axios.post(url, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
            } else {
                await axios.put(url, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
            }
            if (typeof onSuccess === "function") {
                onSuccess();
            }
            setOpen(false)
            startTransition(() => {
                router.refresh()
            })
        } catch (err) {
            const errorMessage =
                err?.response?.data?.error || err?.response?.data || err.message || "Request failed"
            alert(`Failed to ${mode} book: ${errorMessage}`)
        }
    }

    const Trigger = (
        <Button
            type="button"
            variant={mode === "create" ? "default" : "ghost"}
            size={asIcon ? "icon" : "default"}
            aria-label={mode === "create" ? "Add Book" : "Edit Book"}
            className={cn(className)}
        >
            {mode === "create" ? (
                "+ Create"
            ) : asIcon ? (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{Trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-pretty">{mode === "create" ? "Add Book" : "Edit Book"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Name</Label>
                        <Input
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="Enter book name"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Describe the book"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                inputMode="decimal"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2 mt-4">
                        <Label htmlFor="pdf">Upload PDF</Label>
                        <Input
                            id="pdf"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Upload image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={pending}>
                            {mode === "create" ? "Create" : "Save changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BookFormDialog

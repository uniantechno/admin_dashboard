"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { config } from "../../../config"

export function TipFormDialog({ open, onOpenChange, tip = null, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({ title: "", description: "" })

    useEffect(() => {
        if (open) {
            if (tip) setFormData({ title: tip.title || "", description: tip.description || "" })
            else setFormData({ title: "", description: "" })
            setError("")
        }
    }, [open, tip])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((p) => ({ ...p, [name]: value }))
    }

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const payload = {
            title: formData.title,
            description: formData.description
        };

        const baseURL = config.adminUrl || "http://localhost:3000";
        const endpoint = tip ? `${baseURL}/tips/${tip._id || tip.id}` : `${baseURL}/addtip`;
        const method = tip ? "PUT" : "POST";

        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        console.log("SAVE RESULT:", result);

        // ONLY FAIL IF `res.ok === false`
        if (!res.ok) throw new Error(result.message || "Save failed");

        // SUCCESS — refresh list
        onSuccess?.();
        onOpenChange(false);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{tip ? "Edit Tip" : "Create Tip"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
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

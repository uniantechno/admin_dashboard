"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { config } from "../../../config"

export function AstrologyFormDialog({ open, onOpenChange, editingData, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    isActive: true, // added for edit form
  })

  const baseUrl = config.astroUrl

  // ✅ Prefill form when editing
  useEffect(() => {
    if (editingData) {
      setFormData({
        name: editingData.name || "",
        email: editingData.email || "",
        phoneNumber: editingData.phoneNumber || "",
        password: "",
        isActive: editingData.isActive ?? true, // default true
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        isActive: true,
      })
    }
  }, [editingData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = editingData
        ? `${baseUrl}/editprofile/${editingData._id}`
        : `${baseUrl}/register`

      const method = editingData ? "PUT" : "POST"
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        ...(formData.password ? { password: formData.password } : {}),
        ...(editingData ? { isActive: formData.isActive } : {}), // only for edit
      }

      // Remove password if editing and left blank
      if (editingData && !formData.password) {
        delete payload.password
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to submit form")
        return
      }

      onSuccess()
      onOpenChange(false)

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        isActive: true,
      })
    } catch (err) {
      console.error("Form submit error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingData ? "Edit Astrologer" : "Create Astrologer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          {/* 🔒 Show password only when creating */}
          {!editingData && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>
          )}

          {/* 🟢 isActive field only for Edit mode */}
          {editingData && (
            <div>
              <Label htmlFor="isActive">Status</Label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive ? "true" : "false"} // ✅ convert boolean to string
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "true", // ✅ convert string back to boolean
                  }))
                }
                className={`w-full border rounded-md p-2 ${formData.isActive ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                disabled={formData.isActive} // ✅ disable when active
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {formData.isActive && (
                <p className="text-xs text-gray-500 mt-1">
                  Status cannot be changed while astrologer is active.
                </p>
              )}
            </div>
          )}


          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingData ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

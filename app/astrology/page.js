"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AstrologyFormDialog } from "./_components/astrology-form-dialog"
import { config } from "../../config"
import Link from "next/link"

export default function AstrologyPage() {
  const [astrologers, setAstrologers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingData, setEditingData] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const baseUrl = config.astroUrl

  const fetchAstrologers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/allprofile`)
      if (!res.ok) throw new Error("Failed to fetch astrologers")
      const data = await res.json()
      setAstrologers(data.data || [])
    } catch (err) {
      console.log("[v0] Fetch error:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAstrologers()
  }, [])

  const handleCreate = () => {
    setEditingData(null)
    setDialogOpen(true)
  }

  const handleEdit = (astrologer) => {
    setEditingData(astrologer)
    setDialogOpen(true)
  }

  // ✅ DELETE ASTROLOGER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this astrologer?")) return;

    try {
      setDeleting(id);

      const res = await fetch(`${baseUrl}/deleteprofile/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete astrologer");
      }

      alert("Astrologer deleted successfully!");
      await fetchAstrologers();
    } catch (err) {
      console.error("[v0] Delete error:", err.message);
      alert("Failed to delete: " + err.message);
    } finally {
      setDeleting(null);
    }
  };


  // ✅ Only activate inactive astrologers
  // const handleStatusChange = async (astrologer) => {
  //   try {
  //     if (astrologer.isActive) {
  //       alert("Active astrologers cannot be deactivated.")
  //       return
  //     }

  //     const updatedStatus = true

  //     const res = await fetch(`${baseUrl}/editprofile/${astrologer._id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ isActive: updatedStatus }),
  //     })

  //     if (!res.ok) throw new Error("Failed to update status")
  //     await fetchAstrologers()
  //   } catch (err) {
  //     console.log("[v0] Status change error:", err.message)
  //     alert("Failed to change status: " + err.message)
  //   }
  // }

  if (loading) return <div className="p-6">Loading astrologers...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Astrologers</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreate}>+ Create</Button>
             <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
            </Link>
        </div>
        
      </div>

      {error && <div className="rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {astrologers.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-4">
                  No astrologers found
                </TableCell>
              </TableRow>
            ) : (
              astrologers.map((astrologer) => (
                <TableRow key={astrologer._id}>
                  <TableCell>{astrologer.name || "N/A"}</TableCell>
                  <TableCell>{astrologer.email || "N/A"}</TableCell>
                  <TableCell>{astrologer.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{astrologer.credits || 0}</TableCell>

                  {/* ✅ Just show text instead of button */}
                  <TableCell>
                    <span
                      className={`font-medium ${astrologer.isActive ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {astrologer.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(astrologer)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(astrologer._id)}
                      disabled={deleting === astrologer._id}
                    >
                      {deleting === astrologer._id ? "Deleting..." : "Delete"}
                    </Button>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      <AstrologyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingData={editingData}
        onSuccess={fetchAstrologers}
      />
    </div>
  )
}

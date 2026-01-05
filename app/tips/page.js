"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TipFormDialog } from "./_components/tip-form-dialog";
import { config } from "@/config";
import Link from "next/link"

export default function TipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTip, setEditingTip] = useState(null);

 const fetchTips = async () => {
  const baseURL = config.adminUrl || "http://localhost:3000";
  const url = `${baseURL}/tips`;
  console.log("Fetching tips from:", url);

  try {
    const res = await axios.get(url);
    console.log("FULL API RESPONSE:", res.data);

    let data = [];

    // 🔥 MAIN FIX — API returns an array directly
    if (Array.isArray(res.data)) {
      data = res.data;
    } else if (Array.isArray(res.data?.tips)) {
      data = res.data.tips;
    } else if (Array.isArray(res.data?.data)) {
      data = res.data.data;
    }

    console.log("FINAL EXTRACTED TIPS:", data);

    setTips(data);
  } catch (err) {
    console.error("Error fetching tips:", err);
    setError("Failed to load tips. Please try again.");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchTips();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      const baseURL = config.adminUrl || "http://localhost:5000";
      await axios.delete(`${baseURL}/tips/${id}`);

      setTips((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  const handleEdit = (tip) => {
    setEditingTip(tip);
    setDialogOpen(true);
  };

  const handleFormSuccess = async () => {
    await fetchTips();
    setEditingTip(null);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading tips...</div>;
  }

  return (
    <main className="p-6 bg-background text-foreground">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Tips</h1>
          <p className="text-sm text-muted-foreground">
            {tips.length} item{tips.length === 1 ? "" : "s"}
          </p>
        </div>
       <div className="flex gap-2">
        <Button onClick={() => setDialogOpen(true)}>+ Create</Button>
           <Link href="/dashboard">
                    <Button variant="outline">← Back</Button>
                  </Link>
        </div>
      </header>

      {error && (
        <div className="rounded-md border p-4 text-red-500">{error}</div>
      )}

      {tips.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-sm text-muted-foreground">No tips found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, idx) => {
            const id = tip._id || tip.id;

            return (
              <Card key={id ?? idx}>
                <CardHeader>
                  <CardTitle>{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tip.description?.slice(0, 160)}
                    {tip.description?.length > 160 ? "..." : ""}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tip)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      <TipFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tip={editingTip}
        onSuccess={handleFormSuccess}
      />
    </main>
  );
}

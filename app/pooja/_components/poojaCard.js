import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PoojaFormDialog from "./pooja-form-dialog";
import { config } from "@/config";
import axios from "axios";
import { Trash, Eye } from "lucide-react";

export function PoojaCard({
  pooja,
  onPoojaUpdated,
  setLoading,
  setError,
  setPoojas,
}) {
  if (!pooja) return null; // 🔥 SAFETY

  const { _id, title, description, amount } = pooja;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this pooja?")) return;

    try {
      setLoading(true);
      setError(null);

      const baseURL = config.adminUrl || "http://localhost:3000";
      await axios.delete(`${baseURL}/pooja/${_id}`);

      setPoojas((prev) => prev.filter((item) => item._id !== _id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete pooja. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-lg border border-border bg-card text-card-foreground">
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-medium">{title}</h2>
          {amount && (
            <p className="text-sm text-muted-foreground">₹{amount}</p>
          )}
        </div>

        {description && (
          <p
            className="text-sm text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}

        <div className="flex gap-2 mt-2">
          {/* EDIT */}
          <PoojaFormDialog
            mode="edit"
            poojaId={_id}
            initial={pooja}
            asIcon
            onSuccess={onPoojaUpdated}
          />

          {/* DELETE */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="hover:text-red-500"
          >
            <Trash size={18} />
          </Button>

          {/* VIEW */}
          <Link href={`/pooja/ditails/${_id}`}>
            <Button variant="ghost" size="icon">
              <Eye size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

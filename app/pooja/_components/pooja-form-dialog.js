"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { config } from "../../../config";
import axios from "axios";

function normalizeInitial(p = {}) {
  return {
    title: p.title || "",
    description: p.description || "",
    amount: p.amount || "",
  };
}

const PoojaFormDialog = ({
  mode = "create",
  bookId,
  initial,
  asIcon = false,
  className,
  onSuccess,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  // Set default form state
  const [form, setForm] = React.useState(() => normalizeInitial(initial));

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title || "",
      description: form.description || "",
      amount: Number(form.amount) || 0,
    };

    const url =
      mode === "create"
        ? `${config.adminUrl}/addpoojas`
        : `${config.adminUrl}/pooja/${bookId}`;

    try {
      if (mode === "create") {
        await axios.post(url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.put(url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      setOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      let errorMessage = "Request failed";
      if (err?.response?.data) {
        try {
          errorMessage = JSON.stringify(err.response.data, null, 2);
        } catch {
          errorMessage = String(err.response.data);
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }

      alert(`Failed to ${mode} book:\n${errorMessage}`);
      console.error("Submission error:", err);
    }
  };

  const Trigger = (
    <Button
      type="button"
      variant={mode === "create" ? "default" : "ghost"}
      size={asIcon ? "icon" : "default"}
      aria-label={mode === "create" ? "Add Pooja" : "Edit Book"}
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
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-pretty">
            {mode === "create" ? "Add Pooja" : "Edit Pooja"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Enter pooja name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe the pooja"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Price</Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* File upload fields can be re-enabled if backend supports them */}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {mode === "create" ? "Create" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PoojaFormDialog;

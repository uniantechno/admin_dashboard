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
  poojaId,
  initial,
  asIcon = false,
  className,
  onSuccess,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const [form, setForm] = React.useState(() => normalizeInitial(initial));
  const [demoVideo, setDemoVideo] = React.useState(null);
  const [paidVideo, setPaidVideo] = React.useState(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // 🔒 prevent double submit

    setIsSubmitting(true);

    try {
      // 🔥 FormData for file upload
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("amount", Number(form.amount));

      if (demoVideo) formData.append("demoVideo", demoVideo);
      if (paidVideo) formData.append("paidVideo", paidVideo);

      const url =
        mode === "create"
          ? `${config.adminUrl}/addpooja`
          : `${config.adminUrl}/pooja/${poojaId}`;

      if (mode === "create") {
        await axios.post(url, formData);
      } else {
        await axios.put(url, formData);
      }

      // ✅ success
      onSuccess?.();
      setOpen(false);
      startTransition(() => router.refresh());

    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || "Failed to submit pooja"
      );
    } finally {
      setIsSubmitting(false); // 🔓 re-enable button
    }
  };


  const Trigger = (
    <Button
      type="button"
      variant={mode === "create" ? "default" : "ghost"}
      size={asIcon ? "icon" : "default"}
      className={cn(className)}
    >
      {mode === "create" ? "+ Create" : "Edit"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Pooja" : "Edit Pooja"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
              required
            />
          </div>

          {/* 🔥 NEW FILE INPUTS */}
          <div className="grid gap-2">
            <Label>Demo Video</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setDemoVideo(e.target.files[0])}
              required={mode === "create"}
            />
          </div>

          <div className="grid gap-2">
            <Label>Paid Video</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setPaidVideo(e.target.files[0])}
              required={mode === "create"}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create"
                  : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PoojaFormDialog;

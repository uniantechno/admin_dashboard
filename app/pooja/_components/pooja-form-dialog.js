// "use client";

// import * as React from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import { config } from "../../../config";

// const LANGS = ["ta", "en","ml", "ka", "te", "hi"];

// const emptyLang = () =>
//   Object.fromEntries(LANGS.map((l) => [l, ""]));

// function normalizeInitial(p = {}) {
//   return {
//     title: p.title || emptyLang(),
//     description: p.description || emptyLang(),
//     amount: p.amount || "",
//     demoVideo: p.demoVideo || "",
//     paidVideo: p.paidVideo || "",
//   };
// }




// const PoojaFormDialog = ({
//   mode = "create",
//   poojaId,
//   initial,
//   className,
//   onSuccess,
// }) => {
//   const router = useRouter();
//   const [open, setOpen] = React.useState(false);
//   const [form, setForm] = React.useState(() =>
//     normalizeInitial(initial)
//   );
//   const [demoVideo, setDemoVideo] = React.useState(null);
//   const [paidVideo, setPaidVideo] = React.useState(null);

//   const [loading, setLoading] = React.useState(false);

//   const handleLangChange = (type, lang, value) => {
//   setForm((prev) => ({
//     ...prev,
//     [type]: {
//       ...prev[type],
//       [lang]: value,
//     },
//   }));
// };


// const onSubmit = async (e) => {
//   e.preventDefault();
//   if (loading) return;
//   setLoading(true);

//   try {
//     const fd = new FormData();
//     fd.append("title", JSON.stringify(form.title));
//     fd.append("description", JSON.stringify(form.description));
//     fd.append("amount", form.amount);

//     if (demoVideo) fd.append("demoVideo", demoVideo);
//     if (paidVideo) fd.append("paidVideo", paidVideo);

//     const url =
//       mode === "create"
//         ? `${config.adminUrl}/addpooja`
//         : `${config.adminUrl}/pooja/${poojaId}`;

//      const configAxios = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     };

//     if (mode === "create") {
//       await axios.post(url, fd, configAxios);
//     } else {
//       await axios.put(url, fd, configAxios);
//     }

//     onSuccess && onSuccess();
//     setOpen(false);
//     router.refresh();
//   } catch (err) {
//     alert(err?.response?.data?.message || "Failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className={cn(className)}>
//           {mode === "create" ? "+ Add Pooja" : "Edit"}
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "create" ? "Create Pooja" : "Update Pooja"}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={onSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
//           {/* TITLE */}
//           <div>
//             <Label>Title (Multi-Language)</Label>
//             {LANGS.map((l) => (
//               <Input
//                 key={l}
//                 placeholder={`Title (${l})`}
//                 value={form.title[l]}
//                 onChange={(e) =>
//                   handleLangChange("title", l, e.target.value)
//                 }
//                 className="mt-1 h-9"
//               />
//             ))}
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <Label>Description (Multi-Language)</Label>
//             {LANGS.map((l) => (
//               <Textarea
//                 key={l}
//                 placeholder={`Description (${l})`}
//                 value={form.description[l]}
//                 onChange={(e) =>
//                   handleLangChange("description", l, e.target.value)
//                 }
//                 className="mt-1 min-h-[70px]"
//               />
//             ))}
//           </div>

//           {/* AMOUNT */}
//           <div>
//             <Label>Amount</Label>
//             <Input
//               type="number"
//               value={form.amount}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, amount: e.target.value }))
//               }
//               required
//             />
//           </div>

//           {/* VIDEOS */}
//           <div>
//             <Label>Demo Video</Label>
//             <Input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setDemoVideo(e.target.files?.[0] || null)}
//               required={mode === "create"}
//             />
//           </div>

//           <div>
//             <Label>Paid Video</Label>
//             <Input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setPaidVideo(e.target.files?.[0] || null)}
//               required={mode === "create"}
//             />
//           </div>

//           <div className="flex justify-end gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button disabled={loading}>
//               {loading ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PoojaFormDialog;

"use client";

import * as React from "react";
import axios from "axios";
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

/* ---------------- LANG SETUP ---------------- */
const LANGS = ["ta", "en", "ml", "ka", "te", "hi"];

const emptyLang = () =>
  Object.fromEntries(LANGS.map((l) => [l, ""]));

/* -------- normalize helpers (IMPORTANT) -------- */
function normalizeLangObject(obj = {}) {
  const base = emptyLang();

  if (typeof obj === "string") {
    base.en = obj;
    return base;
  }

  return {
    ...base,
    ...obj,
  };
}

function normalizeInitial(p = {}) {
  return {
    title: normalizeLangObject(p.title),
    description: normalizeLangObject(p.description),
    amount: p.amount || "",
    demoVideo: p.demoVideo || "",
    paidVideo: p.paidVideo || "",
  };
}

/* ---------------- COMPONENT ---------------- */
const PoojaFormDialog = ({
  mode = "create",
  poojaId,
  initial,
  className,
  onSuccess,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(normalizeInitial());
  const [demoVideo, setDemoVideo] = React.useState(null);
  const [paidVideo, setPaidVideo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  /* 🔥 EDIT PREFILL FIX */
React.useEffect(() => {
  if (!open) return;

  if (mode === "edit" && initial) {
    setForm({
      title: normalizeLangObject(initial.title),
      description: normalizeLangObject(initial.description),
      amount: initial.amount || "",
      demoVideo: initial.demoVideo || "",
      paidVideo: initial.paidVideo || "",
    });
  }

  if (mode === "create") {
    setForm(normalizeInitial());
  }
}, [open, mode, initial]);


  const handleLangChange = (type, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [lang]: value,
      },
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", JSON.stringify(form.title));
      fd.append("description", JSON.stringify(form.description));
      fd.append("amount", form.amount);

      if (demoVideo) fd.append("demoVideo", demoVideo);
      if (paidVideo) fd.append("paidVideo", paidVideo);

      const baseURL = config.adminUrl || "http://localhost:5000/admin";

      const url =
        mode === "create"
          ? `${baseURL}/addpooja`
          : `${baseURL}/pooja/${poojaId}`;

      const axiosConfig = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      mode === "create"
        ? await axios.post(url, fd, axiosConfig)
        : await axios.put(url, fd, axiosConfig);

      onSuccess && onSuccess();
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)}>
          {mode === "create" ? "+ Add Pooja" : "Edit"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Pooja" : "Update Pooja"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-4 overflow-y-auto max-h-[70vh] pr-2"
        >
          {/* TITLE */}
          <div>
            <Label>Title (Multi-Language)</Label>
            {LANGS.map((l) => (
              <Input
                key={l}
                placeholder={`Title (${l})`}
                value={form.title[l]}
                onChange={(e) =>
                  handleLangChange("title", l, e.target.value)
                }
                className="mt-1 h-9"
              />
            ))}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description (Multi-Language)</Label>
            {LANGS.map((l) => (
              <Textarea
                key={l}
                placeholder={`Description (${l})`}
                value={form.description[l]}
                onChange={(e) =>
                  handleLangChange("description", l, e.target.value)
                }
                className="mt-1 min-h-[70px]"
              />
            ))}
          </div>

          {/* AMOUNT */}
          <div>
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

          {/* VIDEOS */}
          <div>
            <Label>Demo Video</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setDemoVideo(e.target.files?.[0] || null)}
              required={mode === "create"}
            />
          </div>

          <div>
            <Label>Paid Video</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setPaidVideo(e.target.files?.[0] || null)}
              required={mode === "create"}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PoojaFormDialog;

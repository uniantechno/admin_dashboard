"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { config } from "../../../config"

const emptyLang = { ta: "", en: "", ml: "", ka: "", te: "", hi: "" }

const categoryMap = {
  career: {
    en: "Career",
    ta: "தொழில் (Career)",
    te: "వృత్తి (Career)",
    hi: "करियर (Career)",
    ml: "കരിയർ (Career)",
    ka: "ವೃತ್ತಿ (Career)"
  },
  love: {
    en: "Love",
    ta: "காதல் (Love)",
    te: "ప్రేమ (Love)",
    hi: "प्रेम (Love)",
    ml: "പ്രേമം (Love)",
    ka: "ಪ್ರೇಮ (Love)"
  },
  family: {
    en: "Family",
    ta: "குடும்பம் (Family)",
    te: "కుటుంబం (Family)",
    hi: "परिवार (Family)",
    ml: "കുടുംബം (Family)",
    ka: "ಕುಟುಂಬ (Family)"
  },
  education: {
    en: "Education",
    ta: "கல்வி (Education)",
    te: "విద్య (Education)",
    hi: "शिक्षा (Education)",
    ml: "വിദ്യാഭ്യാസം (Education)",
    ka: "ಶಿಕ್ಷಣ (Education)"
  },
  money: {
    en: "Money",
    ta: "பணம் (Money)",
    te: "డబ్బు (Money)",
    hi: "धन (Money)",
    ml: "ധനം (Money)",
    ka: "ಹಣ (Money)"
  },
  health: {
    en: "Health",
    ta: "ஆரோக்கியம் (Health)",
    te: "ఆరోగ్యం (Health)",
    hi: "स्वास्थ्य (Health)",
    ml: "ആരോഗ്യം (Health)",
    ka: "ಆರೋಗ್ಯ (Health)"
  },
  relationship: {
    en: "Relationship",
    ta: "உறவு (Relationship)",
    te: "సంబంధం (Relationship)",
    hi: "रिश्ता (Relationship)",
    ml: "ബന്ധം (Relationship)",
    ka: "ಸಂಬಂಧ (Relationship)"
  }
}



const createEmptyLang = () => ({
  ta: "", en: "", ml: "", ka: "", te: "", hi: ""
})

const normalizeLang = (obj = {}) => ({
  ...createEmptyLang(),
  ...(typeof obj === "string" ? { en: obj } : obj)
})


const normalize = (str = "") =>
  str.toLowerCase().trim()

const getCategoryKeyFromCategory = (categoryObj) => {
  if (!categoryObj?.en) return ""

  const enValue = normalize(categoryObj.en)

  return (
    Object.keys(categoryMap).find(
      key => normalize(categoryMap[key].en) === enValue
    ) || ""
  )
}



export function RemedyFormDialog({ open, onOpenChange, remedy = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    categoryKey: "",
    category: emptyLang,
    description: emptyLang,
    coverImage: null
  })

  /* ---------- PREFILL EDIT ---------- */
useEffect(() => {
  if (!open) return

  if (remedy) {
    const key = getCategoryKeyFromCategory(remedy.category)

    setFormData({
      categoryKey: key,
      category: normalizeLang(categoryMap[key] || remedy.category),
      description: normalizeLang(remedy.description),
      coverImage: null
    })
  } else {
    setFormData({
      categoryKey: "",
      category: createEmptyLang(),
      description: createEmptyLang(),
      coverImage: null
    })
  }

  setError("")
}, [open, remedy])


  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const fd = new FormData()
      fd.append("categoryKey", formData.categoryKey)
      fd.append("category", JSON.stringify(formData.category))
      fd.append("description", JSON.stringify(formData.description))
      if (formData.coverImage) fd.append("coverImage", formData.coverImage)

      const endpoint = remedy
        ? `${config.adminUrl}/editremedy/${remedy._id}`
        : `${config.adminUrl}/addremedy`

      const res = await fetch(endpoint, {
        method: remedy ? "PUT" : "POST",
        body: fd
      })

      const result = await res.json()
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed")
      }

      await onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{remedy ? "Edit Remedy" : "Create Remedy"}</DialogTitle>
        </DialogHeader>

              <form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-h-[65vh] overflow-y-auto pr-2"
              >
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.categoryKey}
              onChange={(e) => {
                const key = e.target.value
                setFormData(prev => ({
                  ...prev,
                  categoryKey: key,
                  category: categoryMap[key]
                }))
              }}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="" disabled>Select category</option>
              {Object.keys(categoryMap).map(key => (
                <option key={key} value={key}>
                  {categoryMap[key].en}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          {["en", "ta", "te", "hi", "ml", "ka"].map(lang => (
            <div key={lang}>
              <label className="block text-sm font-medium mb-1">
                Description ({lang.toUpperCase()})
              </label>
              <Textarea
                rows={2}
                value={formData.description[lang]}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    description: {
                      ...prev.description,
                      [lang]: e.target.value
                    }
                  }))
                }
              />
            </div>
          ))}

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  coverImage: e.target.files?.[0] || null
                }))
              }
            />
            {remedy?.coverImage && (
              <img
                src={remedy.coverImage}
                className="mt-2 w-24 h-24 object-cover rounded"
                alt="cover"
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

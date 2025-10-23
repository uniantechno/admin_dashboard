import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PoojaFormDialog from "../_components/pooja-form-dialog"
import { config } from "../../../config";
import axios from "axios" // ✅ New import



export function PoojaCard({ book, onBookUpdated,setLoading ,setError,setBooks}) {
  const { title, description, amount, coverImage, pdffile } = book;
  const fallbackImage = "/abstract-book-cover.png";
  const displayPrice = amount
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      console.log(book?.id,"bookid");
      
      setLoading(true);
      setError(null);
      const baseURL = config.adminUrl || "http://localhost:3000";
      await axios.delete(`${baseURL}/pooja/${book?.id}`);
      setBooks(prev => prev.filter(item => (item.id ?? item._id ?? idx) !== book?.id));
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className="rounded-lg border border-border overflow-hidden bg-card text-card-foreground"
      aria-label={`Book: ${title}`}
    >
      {/* <div className="aspect-[3/2] bg-muted">
        <img
          src={coverImage || fallbackImage}
          alt={`${title} cover`}
          className="h-full w-full object-cover"
        />
      </div> */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-medium text-pretty">{title}</h2>
          {displayPrice && (
            <p className="text-sm text-muted-foreground mt-1">
              ₹{displayPrice}
            </p>
          )}
        </div>
        {description ? (
          <p
            className="text-sm text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {description}
          </p>
        ) : null}
        <div className="flex items-center gap-2 mt-1">
          {/* {pdffile ? (
            <Button size="sm" variant="secondary" asChild>
              <a href={pdffile} target="_blank" rel="noopener noreferrer">
                Read PDF
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled>
              PDF Unavailable
            </Button>
          )} */}

          <div className="flex flex-row gap-2 items-center">
            {console.log(book?.id, book, "book")}
            <PoojaFormDialog
              mode="edit"
              bookId={book?.id}
              initial={book}
              asIcon
              onSuccess={onBookUpdated}
            />


            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete product"
              className="hover:text-red-500 text-muted-foreground"
              onClick={handleDelete}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-colors"
              >
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 11v6M14 11v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>

          </div>
        </div>

      </div>
    </article>
  );
}

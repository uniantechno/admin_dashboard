import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookFormDialog from "../books/_components/book-form-dialog";


function formatCurrency(value) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function BookCard({ book, onBookUpdated }) {
  const { title, description, price, coverImage, pdffile } = book;
  const fallbackImage = "/abstract-book-cover.png";
  const displayPrice = formatCurrency(price);

  return (
    <article
      className="rounded-lg border border-border overflow-hidden bg-card text-card-foreground"
      aria-label={`Book: ${title}`}
    >
      <div className="aspect-[3/2] bg-muted">
        <img
          src={coverImage || fallbackImage}
          alt={`${title} cover`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-medium text-pretty">{title}</h2>
          {displayPrice && (
            <p className="text-sm text-muted-foreground mt-1">
              {displayPrice}
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
          {pdffile ? (
            <Button size="sm" variant="secondary" asChild>
              <a href={pdffile} target="_blank" rel="noopener noreferrer">
                Read PDF
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled>
              PDF Unavailable
            </Button>
          )}

          <div className="flex flex-row gap-2 items-center">
           {console.log(book?.id,book,"book")}
            <BookFormDialog
              mode="edit"
              bookId={book?.id}
              initial={book}
              asIcon
              onSuccess={onBookUpdated}
            />


            <Button variant="ghost" size="icon" aria-label="Delete product" className="hover:text-red-500 text-muted-foreground">
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

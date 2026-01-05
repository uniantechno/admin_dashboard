"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BookCard } from "../appcomponent/booksCard";
import { config } from "@/config";
import BookFormDialog from "../books/_components/book-form-dialog"


const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchBooks = async () => {
    const baseURL = config.adminUrl || "http://locaslhost:3000";
    const url = `${baseURL}/books`;

    try {
      const response = await axios.get(url);
      const data = response?.data?.books;
      console.log(data, "dataa");
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <main className="p-6 bg-background text-foreground">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">Books</h1>
          <p className="text-sm text-muted-foreground">
            {books.length} item{books.length === 1 ? "" : "s"}f
          </p>
        </div>
        <div className="flex gap-2">
        <BookFormDialog mode="create" onSuccess={fetchBooks} />
           <Link href="/dashboard">
                    <Button variant="outline">← Back</Button>
                  </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <p className="text-sm text-muted-foreground">Loading books...</p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-border p-4 text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-md border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No books found.</p>
        </div>
      ) : (
        <section
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Book list"
        >
          {books.map((b, idx) => (
            <BookCard
              key={b.id ?? idx}
              book={{
                id: b._id,
                title: b.title,
                description: b.description,
                price: b.price,
                coverImage: b.coverImage,
                pdffile: b.pdffile,
              }}
              onBookUpdated={fetchBooks}
              setLoading={setLoading}
              setError={setError}
              setBooks={setBooks}
            />
          ))}

        </section>
      )}
    </main>
  );
};

export default BooksPage;

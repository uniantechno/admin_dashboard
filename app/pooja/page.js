"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {PoojaCard} from "./_components/poojaCard"
import { config } from "@/config";
import PoojaFormDialog from "./_components/pooja-form-dialog";

const Pooja = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchPoojas = async () => {
    const baseURL = config.adminUrl || "http://localhost:3000";
    const url = `${baseURL}/poojas`;

    try {
      const response = await axios.get(url);
      const data = response?.data?.products;
      console.log(data, "poojadata");
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(books?._id,"books");
    
    fetchPoojas();
  }, []);

  return (
    <main className="p-6 bg-background text-foreground">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">Poojas</h1>
          <p className="text-sm text-muted-foreground">
            {books.length} item{books.length === 1 ? "" : "s"}f
          </p>
        </div>
        <PoojaFormDialog mode="create" onSuccess={fetchPoojas} />
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
          <p className="text-sm text-muted-foreground">No poojas found.</p>
        </div>
      ) : (
        <section
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Book list"
        >
          {books.map((b, idx) => (
            <PoojaCard
              key={b._id ?? idx}
              book={{
                id: b._id,
                title: b.title,
                description: b.description,
                amount: b.amount,
                coverImage: b.coverImage,
                pdffile: b.pdffile,
              }}
              onBookUpdated={fetchPoojas}
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

export default Pooja;

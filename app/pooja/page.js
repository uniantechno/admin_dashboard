"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PoojaCard } from "./_components/poojaCard";
import { config } from "@/config";
import PoojaFormDialog from "./_components/pooja-form-dialog";
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Pooja = () => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const fetchPoojas = async () => {
  const baseURL = config.adminUrl || "http://localhost:5000/admin";
  const url = `${baseURL}/poojas`; // 🔥 FIXED HERE

  try {
    setLoading(true);
    const response = await axios.get(url);

    console.log("FULL RESPONSE --->", response.data);

    const data = response?.data?.data;
    setPoojas(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching poojas:", err);
    setError("Failed to load poojas. Please try again.");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchPoojas();
  }, []);

  return (
    <main className="p-6 bg-background text-foreground">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Poojas</h1>
          <p className="text-sm text-muted-foreground">
            {poojas.length} item{poojas.length === 1 ? "" : "s"}
          </p>
        </div>
       <div className="flex gap-2">
        <PoojaFormDialog mode="create" onSuccess={fetchPoojas} />
           <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-8">
          Loading poojas...
        </div>
      ) : error ? (
        <div className="border p-4 text-red-500">{error}</div>
      ) : poojas.length === 0 ? (
        <div className="border p-8 text-center">No poojas found.</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {poojas.map((pooja) => (
            <PoojaCard
              key={pooja._id}
              pooja={pooja}
              onPoojaUpdated={fetchPoojas}
              setLoading={setLoading}
              setError={setError}
              setPoojas={setPoojas}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default Pooja;

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClassCard } from "./_components/classCard";
import { config } from "@/config";
import ClassFormDialog from "./_components/class-form-dialog";

const Class = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClasses = async () => {
        const baseURL = config.adminUrl || "http://localhost:3000";
        const url = `${baseURL}/class`; // 🔥 FIXED HERE

        try {
            setLoading(true);
            const response = await axios.get(url);

            console.log("FULL RESPONSE --->", response.data);

            const data = response?.data?.data;
            setClasses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching classes:", err);
            setError("Failed to load classes. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <main className="p-6 bg-background text-foreground">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Classes</h1>
                    <p className="text-sm text-muted-foreground">
                        {classes.length} item{classes.length === 1 ? "" : "s"}
                    </p>
                </div>

                <ClassFormDialog mode="create" onSuccess={fetchClasses} />
            </header>

            {loading ? (
                <div className="flex justify-center p-8">
                    Loading classes...
                </div>
            ) : error ? (
                <div className="border p-4 text-red-500">{error}</div>
            ) : classes.length === 0 ? (
                <div className="border p-8 text-center">No classes found.</div>
            ) : (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((classItem) => (
                        <ClassCard
                            key={classItem._id}
                            classItem={classItem}
                            onClassUpdated={fetchClasses}
                            setLoading={setLoading}
                            setError={setError}
                            setClasses={setClasses}
                        />
                    ))}
                </section>
            )}
        </main>
    );
};

export default Class;
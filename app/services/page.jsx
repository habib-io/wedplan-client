"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

const CATEGORIES = [
  "all",
  "Photography",
  "Venue",
  "Catering",
  "Decoration",
  "Makeup",
  "Music",
  "Other",
];

export default function BrowseServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category !== "all") params.set("category", category);
        if (sort) params.set("sort", sort);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to load services");
        setServices(await res.json());
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const inputClass =
    "rounded-md border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-500";

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-rose-900">Browse Services</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by name, location, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} flex-1 min-w-[200px]`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={inputClass}
        >
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-rose-100" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="mt-8 text-center text-gray-600">No services found.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s._id} className="overflow-hidden rounded-xl bg-white shadow">
              <img
                src={s.images?.[0]}
                alt={s.serviceName}
                className="h-44 w-full bg-rose-100 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-rose-700">{s.category}</p>
                <h2 className="font-semibold text-rose-900">{s.serviceName}</h2>
                <p className="text-sm text-gray-600">{s.location}</p>
                <p className="mt-2 font-bold">BDT {s.price}</p>
                <Link
                  href={`/services/${s._id}`}
                  className="mt-3 inline-block rounded-md bg-rose-700 px-4 py-1.5 text-sm text-white hover:bg-rose-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
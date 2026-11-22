"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const CARDS = [
  ["totalUsers", "Total Registered Users"],
  ["totalVendors", "Total Vendors"],
  ["totalCustomers", "Total Customers"],
  ["totalServices", "Total Services"],
  ["pendingServices", "Pending Services"],
  ["totalTransactions", "Total Transactions"],
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/admin/stats")
      .then(setStats)
      .catch((err) => {
        setError(err.message);
        toast.error(err.message);
      });
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!stats) return <p className="p-6 text-gray-600">Loading stats...</p>;

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">Admin Overview</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(([key, label]) => (
          <div key={key} className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="mt-2 text-3xl font-bold text-rose-800">{stats[key]}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
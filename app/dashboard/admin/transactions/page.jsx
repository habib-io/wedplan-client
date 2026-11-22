"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function AdminTransactionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/admin/transactions")
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">Transactions</h1>

      {loading ? (
        <p className="mt-6 text-gray-600">Loading transactions...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-gray-600">No transactions yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-rose-50 text-rose-900">
              <tr>
                <th className="p-3">Vendor</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-3">
                    {t.vendor?.businessName || t.vendor?.name || "Unknown"}
                    <br />
                    <span className="text-xs text-gray-500">{t.vendor?.email}</span>
                  </td>
                  <td className="p-3 capitalize">{t.plan}</td>
                  <td className="p-3">
                    {(t.amount / 100).toFixed(2)} {String(t.currency).toUpperCase()}
                  </td>
                  <td className="p-3 capitalize">{t.status}</td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
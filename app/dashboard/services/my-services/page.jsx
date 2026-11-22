"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const badge = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-700",
};

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  const load = () => {
    setLoading(true);
    apiFetch("/api/vendor/services")
      .then(setServices)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setConfirmId(null);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-rose-900">My Services</h1>
        <Link
          href="/dashboard/services/add"
          className="rounded-md bg-rose-700 px-4 py-2 text-white hover:bg-rose-800"
        >
          Add Service
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-gray-600">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="mt-6 text-gray-600">You have not added any service yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {services.map((s) => (
            <div
              key={s._id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow"
            >
              <img
                src={s.images?.[0]}
                alt={s.serviceName}
                className="h-16 w-24 rounded-md bg-rose-100 object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-rose-900">{s.serviceName}</p>
                <p className="text-sm text-gray-600">
                  {s.category} · {s.location} · BDT {s.price}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${badge[s.status]}`}>
                {s.status}
              </span>

              {confirmId === s._id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded-md border px-3 py-1 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(s._id)}
                  className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
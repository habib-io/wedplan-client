"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const badge = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-700",
};

const ACTIONS = {
  pending: [["approved", "Approve"], ["rejected", "Reject"]],
  approved: [["inactive", "Deactivate"]],
  rejected: [["approved", "Approve"]],
  inactive: [["approved", "Activate"]],
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [refresh, setRefresh] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status !== "all") params.set("status", status);
        setServices(await apiFetch(`/api/admin/services?${params.toString()}`));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, refresh]);

  const changeStatus = async (id, newStatus) => {
    setBusyId(id);
    try {
      await apiFetch(`/api/admin/services/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Service marked as ${newStatus}`);
      setRefresh((n) => n + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    setBusyId(id);
    try {
      await apiFetch(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setConfirmId(null);
      setRefresh((n) => n + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const inputClass =
    "rounded-md border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-500";

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">Manage Services</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by service, vendor or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} min-w-[200px] flex-1`}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-gray-600">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="mt-6 text-gray-600">No services found.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {services.map((s) => (
            <div
              key={s._id}
              className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow"
            >
              <img
                src={s.images?.[0]}
                alt={s.serviceName}
                className="h-16 w-24 rounded-md bg-rose-100 object-cover"
              />
              <div className="min-w-[160px] flex-1">
                <p className="font-semibold text-rose-900">{s.serviceName}</p>
                <p className="text-sm text-gray-600">
                  {s.vendorName} · {s.category} · {s.location} · BDT {s.price}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${badge[s.status]}`}>
                {s.status}
              </span>

              <div className="flex flex-wrap gap-2">
                {(ACTIONS[s.status] || []).map(([next, label]) => (
                  <button
                    key={next}
                    disabled={busyId === s._id}
                    onClick={() => changeStatus(s._id, next)}
                    className="rounded-md border border-rose-300 px-3 py-1 text-sm text-rose-700 disabled:opacity-60"
                  >
                    {label}
                  </button>
                ))}

                {confirmId === s._id ? (
                  <>
                    <button
                      onClick={() => remove(s._id)}
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
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmId(s._id)}
                    className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
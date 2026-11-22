"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const badge = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-700",
};

export default function BookingsPage() {
  const [role, setRole] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await apiFetch("/api/me");
        if (!active) return;
        setRole(me.role);
        const path = me.role === "vendor" ? "/api/vendor/bookings" : "/api/bookings/my";
        const data = await apiFetch(path);
        if (active) setBookings(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await apiFetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking ${status.toLowerCase()}`);
      setRefresh((n) => n + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const isVendor = role === "vendor";

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">
        {isVendor ? "Booking Requests" : "My Bookings"}
      </h1>

      {loading ? (
        <p className="mt-6 text-gray-600">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-gray-600">No bookings yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-rose-900">{b.serviceName}</p>
                <span className={`rounded-full px-3 py-1 text-xs ${badge[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {isVendor && <p><b>Customer:</b> {b.customerName}</p>}
                <p><b>Event date:</b> {b.eventDate}</p>
                <p><b>Location:</b> {b.eventLocation}</p>
                {b.message && <p><b>Message:</b> {b.message}</p>}
              </div>

              <div className="mt-3 flex gap-2">
                {isVendor && b.status === "Pending" && (
                  <>
                    <button
                      disabled={busyId === b._id}
                      onClick={() => updateStatus(b._id, "Accepted")}
                      className="rounded-md bg-green-600 px-3 py-1 text-sm text-white disabled:opacity-60"
                    >
                      Accept
                    </button>
                    <button
                      disabled={busyId === b._id}
                      onClick={() => updateStatus(b._id, "Rejected")}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </>
                )}
                {!isVendor && ["Pending", "Accepted"].includes(b.status) && (
                  <button
                    disabled={busyId === b._id}
                    onClick={() => updateStatus(b._id, "Cancelled")}
                    className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 disabled:opacity-60"
                  >
                    Cancel booking
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
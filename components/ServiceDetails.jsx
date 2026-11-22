"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function ServiceDetails({ id }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ eventDate: "", eventLocation: "", message: "" });

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setService)
      .catch(() => toast.error("Failed to load service"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.eventDate || !form.eventLocation) {
      return toast.error("Event date and location are required");
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId: id, ...form }),
      });
      toast.success("Booking request sent");
      router.push("/dashboard/bookings");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-center text-gray-600">Loading service...</p>;
  }
  if (!service) {
    return <p className="p-8 text-center text-gray-600">Service not found.</p>;
  }

  const inputClass =
    "w-full rounded-md border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-500";

  return (
    <main className="mx-auto max-w-4xl p-6">
      <img
        src={service.images?.[0]}
        alt={service.serviceName}
        className="h-72 w-full rounded-xl bg-rose-100 object-cover"
      />

      {service.images?.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {service.images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${service.serviceName} ${i + 2}`}
              className="h-20 w-28 rounded-md bg-rose-100 object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-4 rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-rose-700">{service.category}</p>
        <h1 className="text-2xl font-bold text-rose-900">{service.serviceName}</h1>
        <p className="mt-1 text-gray-600">
          {service.vendorName} · {service.location}
        </p>
        <p className="mt-3 text-xl font-bold">BDT {service.price}</p>
        <p className="mt-4 whitespace-pre-line text-gray-700">{service.description}</p>

        <div className="mt-6">
          {!session ? (
            <Link
              href="/login"
              className="inline-block rounded-md bg-rose-700 px-5 py-2 text-white hover:bg-rose-800"
            >
              Login to book this service
            </Link>
          ) : !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-md bg-rose-700 px-5 py-2 text-white hover:bg-rose-800"
            >
              Book This Service
            </button>
          ) : (
            <form onSubmit={handleBook} className="space-y-3">
              <input
                type="date"
                name="eventDate"
                min={today}
                value={form.eventDate}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="eventLocation"
                placeholder="Event location"
                value={form.eventLocation}
                onChange={handleChange}
                className={inputClass}
              />
              <textarea
                name="message"
                rows={3}
                placeholder="Additional message (optional)"
                value={form.message}
                onChange={handleChange}
                className={inputClass}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-rose-700 px-5 py-2 text-white hover:bg-rose-800 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Booking Request"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border px-5 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
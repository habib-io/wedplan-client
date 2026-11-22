"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
  "Photography",
  "Venue",
  "Catering",
  "Decoration",
  "Makeup",
  "Music",
  "Other",
];

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    category: "Photography",
    price: "",
    location: "",
    description: "",
    images: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const images = form.images
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    if (!form.serviceName || !form.price || !form.location || !form.description) {
      return toast.error("Please fill in all required fields");
    }
    if (images.length === 0) {
      return toast.error("Add at least one image URL");
    }

    setLoading(true);
    try {
      await apiFetch("/api/services", {
        method: "POST",
        body: JSON.stringify({ ...form, price: Number(form.price), images }),
      });
      toast.success("Service submitted for admin review");
      router.push("/dashboard/my-services");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-500";

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold text-rose-900">Add Service</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow">
        <input
          name="serviceName"
          placeholder="Service name"
          value={form.serviceName}
          onChange={handleChange}
          className={inputClass}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          min="1"
          placeholder="Price (BDT)"
          value={form.price}
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="location"
          placeholder="Location (e.g. Dhaka)"
          value={form.location}
          onChange={handleChange}
          className={inputClass}
        />

        <textarea
          name="description"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className={inputClass}
        />

        <textarea
          name="images"
          rows={3}
          placeholder={"Image URLs (one per line)\nhttps://example.com/photo.jpg"}
          value={form.images}
          onChange={handleChange}
          className={inputClass}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-rose-700 py-2 text-white hover:bg-rose-800 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Service"}
        </button>
      </form>
    </main>
  );
}
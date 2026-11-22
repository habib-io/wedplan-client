"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    businessName: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill in all required fields");
    }
    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    if (form.role === "vendor" && !form.businessName) {
      return toast.error("Business name is required for vendors");
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      businessName: form.role === "vendor" ? form.businessName : undefined,
    });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Registration failed");
    }

    toast.success("Account created successfully");
    router.push("/");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-md border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-500";

  return (
    <main className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-rose-900">Create account</h1>

        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="customer">I am a Customer</option>
          <option value="vendor">I am a Vendor</option>
        </select>

        {form.role === "vendor" && (
          <input
            name="businessName"
            placeholder="Business name"
            value={form.businessName}
            onChange={handleChange}
            className={inputClass}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-rose-700 py-2 text-white hover:bg-rose-800 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-700 underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
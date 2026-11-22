"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please enter email and password");
    }

    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Login failed");
    }

    toast.success("Logged in successfully");
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
        <h1 className="text-2xl font-bold text-rose-900">Login</h1>

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
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-rose-700 py-2 text-white hover:bg-rose-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          No account?{" "}
          <Link href="/register" className="text-rose-700 underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
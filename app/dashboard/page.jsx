"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch("/api/me")
      .then((u) => {
        if (u.role === "admin") {
          router.replace("/dashboard/admin");
          return;
        }
        setUser(u);
      })
      .catch((err) => {
        toast.error(err.message);
        router.push("/login");
      });
  }, [router]);

  if (!user) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">Dashboard</h1>
      <div className="mt-4 rounded-xl bg-white p-6 shadow">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Plan:</b> {user.subscriptionPlan}</p>
      </div>
    </main>
  );
}
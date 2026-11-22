"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const NAV = {
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/users", label: "Manage Users" },
    { href: "/dashboard/admin/services", label: "Manage Services" },
    { href: "/dashboard/admin/transactions", label: "Transactions" },
  ],
  vendor: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/services/add", label: "Add Service" },
    { href: "/dashboard/my-services", label: "My Services" },
    { href: "/dashboard/bookings", label: "Booking Requests" },
    { href: "/dashboard/premium", label: "Premium" },
  ],
  customer: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/bookings", label: "My Bookings" },
  ],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    apiFetch("/api/me")
      .then((u) => setRole(u.role))
      .catch((err) => {
        toast.error(err.message);
        router.push("/login");
      });
  }, [router]);

  if (!role) {
    return <p className="p-8 text-center text-gray-600">Loading dashboard...</p>;
  }

  const links = NAV[role] || NAV.customer;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-3 shadow md:flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                pathname === l.href
                  ? "bg-rose-700 text-white"
                  : "text-gray-700 hover:bg-rose-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
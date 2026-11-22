"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-rose-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-rose-900">
          WedPlan
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/services" className="text-gray-700 hover:text-rose-700">
            Browse Services
          </Link>

          {isPending ? null : session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-rose-700">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md bg-rose-700 px-4 py-2 text-white hover:bg-rose-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-rose-700">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-rose-700 px-4 py-2 text-white hover:bg-rose-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
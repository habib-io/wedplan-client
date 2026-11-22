"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function PremiumPage() {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    apiFetch("/api/me")
      .then(setUser)
      .catch((err) => toast.error(err.message));
  }, [refresh]);

  const upgrade = async () => {
    setBusy(true);
    try {
      const { url } = await apiFetch("/api/payments/create-checkout-session", {
        method: "POST",
      });
      window.location.href = url;
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      const data = await apiFetch("/api/payments/cancel-subscription", {
        method: "POST",
      });
      toast.success(data.message);
      setRefresh((n) => n + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!user) return <p className="p-6 text-gray-600">Loading...</p>;

  const isPremium = user.subscriptionPlan === "premium";

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">Premium</h1>

      <div className="mt-4 rounded-xl bg-white p-6 shadow">
        <p>
          <b>Current plan:</b>{" "}
          <span className="capitalize">{user.subscriptionPlan}</span>
        </p>
        {isPremium && user.subscriptionExpiresAt && (
          <p className="mt-1">
            <b>Valid until:</b>{" "}
            {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
          </p>
        )}

        {!isPremium ? (
          <>
            <p className="mt-4 text-gray-700">
              Free vendors can have up to 3 active services. Upgrade to Premium
              to publish more.
            </p>
            <p className="mt-2 text-xl font-bold">$10 / month</p>
            <button
              onClick={upgrade}
              disabled={busy}
              className="mt-4 rounded-md bg-rose-700 px-5 py-2 text-white hover:bg-rose-800 disabled:opacity-60"
            >
              {busy ? "Redirecting to Stripe..." : "Upgrade to Premium"}
            </button>
          </>
        ) : (
          <button
            onClick={cancel}
            disabled={busy}
            className="mt-4 rounded-md border border-red-300 px-5 py-2 text-red-600 disabled:opacity-60"
          >
            {busy ? "Please wait..." : "Cancel subscription"}
          </button>
        )}
      </div>
    </main>
  );
}
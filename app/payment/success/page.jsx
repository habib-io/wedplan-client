"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState("checking"); // checking | active | pending | error

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      return;
    }

    let cancelled = false;
    let tries = 0;

    const check = async () => {
      try {
        const data = await apiFetch(
          `/api/payments/session-status?session_id=${sessionId}`
        );
        if (cancelled) return;

        // Premium is activated ONLY by the Stripe webhook. We just wait for it.
        if (data.premiumActive) {
          setState("active");
          return;
        }
        if (++tries >= 10) {
          setState("pending");
          return;
        }
        setTimeout(check, 2000);
      } catch {
        if (!cancelled) setState("error");
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <div className="rounded-xl bg-white p-8 shadow">
        {state === "checking" && (
          <>
            <h1 className="text-xl font-bold text-rose-900">Confirming your payment...</h1>
            <p className="mt-2 text-gray-600">Please wait a moment.</p>
          </>
        )}
        {state === "active" && (
          <>
            <h1 className="text-2xl font-bold text-green-700">Payment successful</h1>
            <p className="mt-2 text-gray-600">Your Premium plan is now active.</p>
          </>
        )}
        {state === "pending" && (
          <>
            <h1 className="text-xl font-bold text-rose-900">Payment received</h1>
            <p className="mt-2 text-gray-600">
              Premium is still being confirmed. Refresh your dashboard in a minute.
            </p>
          </>
        )}
        {state === "error" && (
          <>
            <h1 className="text-xl font-bold text-red-600">Could not verify payment</h1>
            <p className="mt-2 text-gray-600">Please check your dashboard or try again.</p>
          </>
        )}

        <Link
          href="/dashboard/premium"
          className="mt-6 inline-block rounded-md bg-rose-700 px-5 py-2 text-white hover:bg-rose-800"
        >
          Go to Premium
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-gray-600">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
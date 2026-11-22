import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-rose-900">Payment cancelled</h1>
        <p className="mt-2 text-gray-600">No money was charged.</p>
        <Link
          href="/dashboard/premium"
          className="mt-6 inline-block rounded-md bg-rose-700 px-5 py-2 text-white hover:bg-rose-800"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}
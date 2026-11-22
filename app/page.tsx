import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-rose-50 px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-rose-900">
        WedPlan
      </h1>
      <p className="mt-4 max-w-xl text-lg text-rose-800/80">
        Find trusted wedding vendors, book services, and plan your perfect day.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded-md bg-rose-700 px-6 py-3 text-white hover:bg-rose-800"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-rose-700 px-6 py-3 text-rose-700 hover:bg-rose-100"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
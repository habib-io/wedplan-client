export async function apiFetch(path, options = {}) {
  const tokenRes = await fetch("/api/token");
  if (!tokenRes.ok) throw new Error("Please login first");
  const { token } = await tokenRes.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
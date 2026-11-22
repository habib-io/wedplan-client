"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [refresh, setRefresh] = useState(0);
  const [detail, setDetail] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role !== "all") params.set("role", role);
        setUsers(await apiFetch(`/api/admin/users?${params.toString()}`));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, role, refresh]);

  const showDetails = async (id) => {
    try {
      setDetail(await apiFetch(`/api/admin/users/${id}`));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleBlock = async (u) => {
    setBusyId(u._id);
    try {
      await apiFetch(`/api/admin/users/${u._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !u.isBlocked }),
      });
      toast.success(u.isBlocked ? "User unblocked" : "User blocked");
      setRefresh((n) => n + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const inputClass =
    "rounded-md border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-500";

  return (
    <main className="p-2">
      <h1 className="text-2xl font-bold text-rose-900">Manage Users</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} min-w-[200px] flex-1`}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {detail && (
        <div className="mt-4 rounded-xl bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-rose-900">User Details</h2>
            <button onClick={() => setDetail(null)} className="text-sm text-gray-500">
              Close
            </button>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <p><b>Name:</b> {detail.name}</p>
            <p><b>Email:</b> {detail.email}</p>
            <p><b>Role:</b> {detail.role}</p>
            {detail.businessName && <p><b>Business:</b> {detail.businessName}</p>}
            <p><b>Plan:</b> {detail.subscriptionPlan || "free"}</p>
            {detail.subscriptionExpiresAt && (
              <p>
                <b>Plan expires:</b>{" "}
                {new Date(detail.subscriptionExpiresAt).toLocaleDateString()}
              </p>
            )}
            <p><b>Blocked:</b> {detail.isBlocked ? "Yes" : "No"}</p>
            {detail.createdAt && (
              <p><b>Joined:</b> {new Date(detail.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="mt-6 text-gray-600">No users found.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-rose-50 text-rose-900">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.isBlocked ? (
                      <span className="text-red-600">Blocked</span>
                    ) : (
                      <span className="text-green-700">Active</span>
                    )}
                  </td>
                  <td className="flex gap-2 p-3">
                    <button
                      onClick={() => showDetails(u._id)}
                      className="rounded-md border px-3 py-1"
                    >
                      Details
                    </button>
                    {u.role !== "admin" && (
                      <button
                        disabled={busyId === u._id}
                        onClick={() => toggleBlock(u)}
                        className={`rounded-md px-3 py-1 text-white disabled:opacity-60 ${
                          u.isBlocked ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
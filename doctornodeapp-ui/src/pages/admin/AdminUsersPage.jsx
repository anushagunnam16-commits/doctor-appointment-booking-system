// src/pages/admin/AdminUsersPage.jsx
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../services/adminUsers";
import AdminNav from "../../components/admin/AdminNav";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const list = await fetchAdminUsers();
      setUsers(list);
    } catch (err) {
      console.error("loadUsers error", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}>
              <AdminNav />   {/* 👈 added */}
      <h1>Admin – Users</h1>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "0.5rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Role</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Phone</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Verified?</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: "4px 8px" }}>{u.id}</td>
                <td style={{ padding: "4px 8px" }}>{u.name}</td>
                <td style={{ padding: "4px 8px" }}>{u.email}</td>
                <td style={{ padding: "4px 8px" }}>{u.role}</td>
                <td style={{ padding: "4px 8px" }}>{u.phone}</td>
                <td style={{ padding: "4px 8px" }}>
                  {u.email_verified ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

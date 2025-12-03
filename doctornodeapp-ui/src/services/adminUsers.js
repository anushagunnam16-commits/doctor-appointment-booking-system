// src/services/adminUsers.js
import client from "../api/client";

// GET /api/admin/users
export async function fetchAdminUsers() {
  const { data } = await client.get("/api/admin/users");
  return Array.isArray(data.users) ? data.users : [];
}

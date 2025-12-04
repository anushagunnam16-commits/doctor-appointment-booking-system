// src/services/auth.js
import client from "../api/client";

// POST /api/auth/forgot-password
export async function requestPasswordReset(email) {
  const { data } = await client.post("/api/auth/forgot-password", { email });
  return data; // { ok, message }
}

// POST /api/auth/reset-password
export async function resetPassword({ email, code, password }) {
  const { data } = await client.post("/api/auth/reset-password", {
    email,
    code,
    password,
  });
  return data; // { ok, message }
}

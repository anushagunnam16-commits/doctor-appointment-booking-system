// src/services/adminDoctors.js
import client from "../api/client";

// GET /api/admin/doctors
export async function fetchAdminDoctors() {
  const { data } = await client.get("/api/admin/doctors");
  // backend returns { ok, doctors: [...] }
  return Array.isArray(data.doctors) ? data.doctors : [];
}

// POST /api/admin/doctors
export async function createAdminDoctor(payload) {
  const { data } = await client.post("/api/admin/doctors", payload);
  // backend returns { ok, message, doctor }
  return data.doctor;
}

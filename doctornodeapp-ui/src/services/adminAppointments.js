// src/services/adminAppointments.js
import client from "../api/client";

// GET /api/admin/appointments?doctorId=&patientId=&date=
export async function fetchAdminAppointments(filters = {}) {
  const params = {};

  if (filters.doctorId) {
    params.doctorId = filters.doctorId;
  }
  if (filters.patientId) {
    params.patientId = filters.patientId;
  }
  if (filters.date) {
    params.date = filters.date; // YYYY-MM-DD
  }

  const { data } = await client.get("/api/admin/appointments", { params });
  return Array.isArray(data.appointments) ? data.appointments : [];
}

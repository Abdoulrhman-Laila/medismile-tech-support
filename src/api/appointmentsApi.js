// src/api/appointmentsApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة المواعيد
 * GET /api/appointments/
 */
export const fetchAppointments = async (params = {}) => {
  try {
    const res = await accountsAxios.get("appointments/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة المواعيد:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل موعد واحد
 * GET /api/appointments/<appointment_id>/
 */
export const getAppointmentDetails = async (appointmentId) => {
  try {
    const res = await accountsAxios.get(`appointments/${appointmentId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل الموعد:", error.response?.data || error.message);
    throw error;
  }
};




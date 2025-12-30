// src/api/notificationsApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة الإشعارات الخاصة بالدعم التقني
 * GET /api/notifications/
 * التحقق من الـ token يتم تلقائياً من خلال axios interceptor
 */
export const fetchNotifications = async (params = {}) => {
  try {
    const res = await accountsAxios.get("notifications/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة الإشعارات:", error.response?.data || error.message);
    throw error;
  }
};

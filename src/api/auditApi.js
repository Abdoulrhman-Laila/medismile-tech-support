// src/api/auditApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب سجلات التدقيق
 * GET /api/audit/logs/
 */
export const fetchAuditLogs = async (params = {}) => {
  try {
    const res = await accountsAxios.get("audit/logs/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب سجلات التدقيق:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب إحصائيات التدقيق
 * GET /api/audit/statistics/
 */
export const getAuditStatistics = async () => {
  try {
    const res = await accountsAxios.get("audit/statistics/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب إحصائيات التدقيق:", error.response?.data || error.message);
    throw error;
  }
};




// src/api/casesApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة الحالات السريرية
 * GET /api/cases/
 */
export const fetchCases = async (params = {}) => {
  try {
    const res = await accountsAxios.get("cases/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة الحالات:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل حالة سريرية واحدة
 * GET /api/cases/<case_id>/
 */
export const getCaseDetails = async (caseId) => {
  try {
    const res = await accountsAxios.get(`cases/${caseId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل الحالة:", error.response?.data || error.message);
    throw error;
  }
};




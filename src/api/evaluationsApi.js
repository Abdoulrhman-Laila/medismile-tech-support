// src/api/evaluationsApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة التقييمات
 * GET /api/evaluations/
 */
export const fetchEvaluations = async (params = {}) => {
  try {
    const res = await accountsAxios.get("evaluations/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة التقييمات:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل تقييم واحد
 * GET /api/evaluations/<evaluation_id>/
 */
export const getEvaluationDetails = async (evaluationId) => {
  try {
    const res = await accountsAxios.get(`evaluations/${evaluationId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل التقييم:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إحصائيات التقييمات لطالب محدد
 * GET /api/evaluations/students/<student_id>/statistics/
 */
export const getStudentStatistics = async (studentId) => {
  try {
    const res = await accountsAxios.get(`evaluations/students/${studentId}/statistics/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب إحصائيات الطالب:", error.response?.data || error.message);
    throw error;
  }
};




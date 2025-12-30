// src/api/reportsApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة التقارير
 * GET /api/reports/
 */
export const fetchReports = async (params = {}) => {
  try {
    const res = await accountsAxios.get("reports/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة التقارير:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل تقرير واحد
 * GET /api/reports/<report_id>/
 */
export const getReportDetails = async (reportId) => {
  try {
    const res = await accountsAxios.get(`reports/${reportId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل التقرير:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إنشاء تقرير جديد
 * POST /api/reports/
 */
export const createReport = async (data) => {
  try {
    const res = await accountsAxios.post("reports/", data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء التقرير:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تحديث حالة التقرير (إخفاء/إظهار فقط)
 * PATCH /api/reports/<report_id>/
 */
export const updateReportStatus = async (reportId, isActive) => {
  try {
    const res = await accountsAxios.patch(`reports/${reportId}/`, { is_active: isActive });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث حالة التقرير:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تقارير طالب محدد
 * GET /api/reports/students/<student_id>/
 */
export const fetchStudentReports = async (studentId) => {
  try {
    const res = await accountsAxios.get(`reports/students/${studentId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تقارير الطالب:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تقارير جامعة محددة
 * GET /api/reports/universities/<university_id>/
 */
export const fetchUniversityReports = async (universityId) => {
  try {
    const res = await accountsAxios.get(`reports/universities/${universityId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تقارير الجامعة:", error.response?.data || error.message);
    throw error;
  }
};




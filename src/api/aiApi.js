// src/api/aiApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة تشخيصات الذكاء الاصطناعي
 * GET /api/ai/diagnoses/
 */
export const fetchAIDiagnoses = async (params = {}) => {
  try {
    const res = await accountsAxios.get("ai/diagnoses/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة تشخيصات AI:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل تشخيص واحد
 * GET /api/ai/diagnoses/<diagnosis_id>/
 */
export const getAIDiagnosisDetails = async (diagnosisId) => {
  try {
    const res = await accountsAxios.get(`ai/diagnoses/${diagnosisId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل تشخيص AI:", error.response?.data || error.message);
    throw error;
  }
};




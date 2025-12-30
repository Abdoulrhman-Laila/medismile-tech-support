// src/api/communityApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة المحتوى المجتمعي
 * GET /api/community/
 */
export const fetchContent = async (params = {}) => {
  try {
    const res = await accountsAxios.get("community/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة المحتوى المجتمعي:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل عنصر محتوى
 * GET /api/community/<content_id>/
 */
export const getContentDetails = async (contentId) => {
  try {
    const res = await accountsAxios.get(`community/${contentId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل المحتوى المجتمعي:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب المحتوى الرائج
 * GET /api/community/trending/
 */
export const getTrendingContent = async () => {
  try {
    const res = await accountsAxios.get("community/trending/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب المحتوى الرائج:", error.response?.data || error.message);
    throw error;
  }
};




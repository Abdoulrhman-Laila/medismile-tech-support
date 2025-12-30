// src/api/attachmentsApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة المرفقات
 * GET /api/attachments/
 */
export const fetchAttachments = async (params = {}) => {
  try {
    const res = await accountsAxios.get("attachments/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة المرفقات:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل مرفق واحد
 * GET /api/attachments/<attachment_id>/
 */
export const getAttachmentDetails = async (attachmentId) => {
  try {
    const res = await accountsAxios.get(`attachments/${attachmentId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل المرفق:", error.response?.data || error.message);
    throw error;
  }
};




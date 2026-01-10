// src/api/communityApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة الـ Posts
 * GET /api/community/posts/
 * Query params: status, author_id, content_type
 * Roles: patient, student, supervisor, university_admin, tech_support (read-only)
 */
export const fetchPosts = async (params = {}) => {
  try {
    const res = await accountsAxios.get("community/posts/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة الـ Posts:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل Post معين
 * GET /api/community/posts/{id}/
 * Roles: patient, student, supervisor, university_admin, tech_support (read-only)
 */
export const getPostDetails = async (postId) => {
  try {
    const res = await accountsAxios.get(`community/posts/${postId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل الـ Post:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب قائمة Posts المعلقة (Pending)
 * GET /api/community/posts/pending/
 * Roles: supervisor
 */
export const fetchPendingPosts = async () => {
  try {
    const res = await accountsAxios.get("community/posts/pending/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب Posts المعلقة:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب سجلات الموافقة (Approval Logs)
 * GET /api/community/approval-logs/
 * Roles: university_admin, tech_support
 */
export const fetchApprovalLogs = async () => {
  try {
    const res = await accountsAxios.get("community/approval-logs/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب سجلات الموافقة:", error.response?.data || error.message);
    throw error;
  }
};

// ──────────── Legacy/Backward Compatibility ────────────
// للحفاظ على التوافق مع الكود الحالي

/**
 * @deprecated استخدم fetchPosts بدلاً منها
 * جلب قائمة المحتوى المجتمعي (Legacy)
 */
export const fetchContent = async (params = {}) => {
  return fetchPosts(params);
};

/**
 * @deprecated استخدم getPostDetails بدلاً منها
 * جلب تفاصيل عنصر محتوى (Legacy)
 */
export const getContentDetails = async (contentId) => {
  return getPostDetails(contentId);
};




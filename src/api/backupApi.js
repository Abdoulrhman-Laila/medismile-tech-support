// src/api/backupApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة النسخ الاحتياطية
 * GET /api/backup/backups/history/
 */
export const fetchBackups = async () => {
  try {
    const res = await accountsAxios.get("backup/backups/history/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب النسخ الاحتياطية:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تشغيل نسخة احتياطية (إنشاء مهمة نسخ)
 * POST /api/backup/backups/run/
 * @param {Object} data - بيانات النسخة الاحتياطية
 * @param {string} data.backup_type - نوع النسخة (full, incremental...)
 * @param {string} [data.description] - وصف / ملاحظات (اختياري)
 */
export const createBackup = async (data) => {
  try {
    const res = await accountsAxios.post("backup/backups/run/", data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء نسخة احتياطية:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 استعادة نسخة احتياطية
 * POST /api/backup/jobs/<id>/restore/
 * @param {string} backupId - معرف النسخة المراد استعادتها
 * @param {Object} data - بيانات الاستعادة
 * @param {string} data.restore_type - نوع الاستعادة (FULL, INCREMENTAL...)
 */
export const restoreBackup = async (backupId, data) => {
  try {
    const res = await accountsAxios.post(`backup/jobs/${backupId}/restore/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في استعادة النسخة الاحتياطية:", error.response?.data || error.message);
    throw error;
  }
};

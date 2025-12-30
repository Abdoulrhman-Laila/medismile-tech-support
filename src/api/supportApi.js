// src/api/supportApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة تذاكر الدعم الفني
 * GET /api/support/tickets/
 */
export const fetchTickets = async (params = {}) => {
  try {
    const res = await accountsAxios.get("support/tickets/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة تذاكر الدعم:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل تذكرة واحدة
 * GET /api/support/tickets/<ticket_id>/
 */
export const getTicketDetails = async (ticketId) => {
  try {
    const res = await accountsAxios.get(`support/tickets/${ticketId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل تذكرة الدعم:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تحديث تذكرة دعم فني
 * PATCH /api/support/tickets/<ticket_id>/
 * 
 * الحقول المتاحة للتحديث (Tech Support):
 * - status: حالة التذكرة (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
 * - priority: أولوية التذكرة (urgent, medium, low)
 * - assigned_to: معرف المستخدم المسؤول (UUID)
 * - resolution: ملخص الحل
 */
export const updateTicket = async (ticketId, data) => {
  try {
    console.log(`📤 PATCH /api/support/tickets/${ticketId}/`, data);
    const res = await accountsAxios.patch(`support/tickets/${ticketId}/`, data);
    console.log("✅ تم تحديث التذكرة بنجاح:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث تذكرة الدعم:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب ردود تذكرة معينة
 * GET /api/support/tickets/<ticket_id>/responses/
 */
export const fetchTicketResponses = async (ticketId) => {
  try {
    const res = await accountsAxios.get(`support/tickets/${ticketId}/responses/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب ردود تذكرة الدعم:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إضافة رد جديد على تذكرة
 * POST /api/support/tickets/<ticket_id>/responses/
 */
export const addTicketResponse = async (ticketId, data) => {
  try {
    const res = await accountsAxios.post(`support/tickets/${ticketId}/responses/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إضافة رد على تذكرة الدعم:", error.response?.data || error.message);
    throw error;
  }
};


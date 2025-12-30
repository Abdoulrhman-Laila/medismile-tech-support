// src/api/messagingApi.js
import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة غرف الرسائل
 * GET /api/messaging/rooms/
 */
export const fetchRooms = async (params = {}) => {
  try {
    const res = await accountsAxios.get("messaging/rooms/", { params });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب غرف المراسلة:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل غرفة واحدة
 * GET /api/messaging/rooms/<room_id>/
 */
export const getRoomDetails = async (roomId) => {
  try {
    const res = await accountsAxios.get(`messaging/rooms/${roomId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل الغرفة:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب رسائل غرفة
 * GET /api/messaging/messages/?room_id=<room_id>
 */
export const fetchMessages = async (roomId, params = {}) => {
  try {
    const res = await accountsAxios.get("messaging/messages/", {
      params: { room_id: roomId, ...params },
    });
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب رسائل الغرفة:", error.response?.data || error.message);
    throw error;
  }
};




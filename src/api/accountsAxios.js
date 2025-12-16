// src/api/accountsAxios.js
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://medismile1-production.up.railway.app/api/v1").replace(/\/+$/, "");

const accountsAxios = axios.create({
  baseURL: `${API_BASE_URL}/`,
});

// Logging requests
accountsAxios.interceptors.request.use(
  (config) => {
    console.log("📤 إرسال طلب:", config.method?.toUpperCase(), config.url);
    console.log("📦 البيانات المرسلة:", config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Logging errors
accountsAxios.interceptors.response.use(
  (response) => {
    console.log("✅ استجابة ناجحة:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ خطأ في الطلب:", error.response.status);
      console.error("📋 تفاصيل الخطأ:", error.response.data);
      console.error("🔗 URL:", error.config?.url);
      console.error("📦 البيانات المرسلة:", error.config?.data);
    } else if (error.request) {
      console.error("❌ لم يتم استلام أي استجابة من السيرفر");
      console.error("🔗 URL:", error.config?.url);
    } else {
      console.error("❌ خطأ غير متوقع:", error.message);
    }
    return Promise.reject(error);
  }
);

export default accountsAxios;

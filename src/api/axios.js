import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://medi-smile1.onrender.com/api").replace(/\/+$/, "");

// إنشاء axios instance مع الإعدادات الأساسية
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/universities`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor لإضافة Token إذا لزم الأمر
axiosInstance.interceptors.request.use(
  (config) => {
    // يمكن إضافة Token من localStorage هنا
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor لمعالجة الأخطاء
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // معالجة الأخطاء الشائعة
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.baseURL + (error.config?.url || "");
      
      // إظهار الأخطاء الحرجة فقط
      if (status >= 500) {
        console.error(`[${status}] خطأ في الخادم: ${url}`);
      }
    } else if (error.request) {
      console.error("❌ لا يمكن الاتصال بالخادم - تأكد من تشغيل Django Backend");
    } else {
      console.error("❌ حدث خطأ في الإعدادات:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

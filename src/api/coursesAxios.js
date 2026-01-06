import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://medismile1-production.up.railway.app/api").replace(/\/+$/, "");

// إنشاء axios instance خاص بالمقررات
const coursesAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor لإضافة Token إذا لزم الأمر
coursesAxiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor لمعالجة الأخطاء
coursesAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.baseURL + (error.config?.url || "");
      
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

export default coursesAxiosInstance;


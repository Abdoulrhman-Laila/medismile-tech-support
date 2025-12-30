// src/api/accountsAxios.js
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://medi-smile1.onrender.com/api").replace(/\/+$/, "");

const accountsAxios = axios.create({
  baseURL: `${API_BASE_URL}/`,
});

// Request interceptor لإضافة JWT token تلقائياً
accountsAxios.interceptors.request.use(
  (config) => {
    // لا نضيف token لطلبات login/logout/register/refresh
    const publicEndpoints = [
      // Auth
      "accounts/login/tech-support/",
      "accounts/logout/tech-support/",
      // Public registration
      "accounts/patients/register/",
      // Token refresh
      "token/refresh/",
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // إضافة Access Token من localStorage إذا كان موجوداً ولم يكن endpoint عام
    if (!isPublicEndpoint && typeof window !== "undefined") {
      const accessToken = localStorage.getItem("mediSmile_accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    console.log("📤 إرسال طلب:", config.method?.toUpperCase(), config.url);
    if (config.data) {
      // إخفاء كلمة المرور في الـ logs
      const logData = { ...config.data };
      if (logData.password) logData.password = "***";
      console.log("📦 البيانات المرسلة:", logData);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor لمعالجة الأخطاء وتجديد Token
accountsAxios.interceptors.response.use(
  (response) => {
    console.log("✅ استجابة ناجحة:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 (غير مصرح) ولم نكن قد حاولنا تجديد Token من قبل
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // محاولة تجديد Access Token باستخدام Refresh Token
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("mediSmile_refreshToken");
          
          if (refreshToken) {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://medi-smile1.onrender.com/api").replace(/\/+$/, "");
            
            // استخدام axios مباشرة لتجنب interceptor loop
            const response = await axios.post(
              `${API_BASE_URL}/token/refresh/`,
              { refresh: refreshToken }
            );

            const { access } = response.data;
            
            // حفظ Access Token الجديد
            localStorage.setItem("mediSmile_accessToken", access);
            
            // تحديث الطلب الأصلي بـ Token الجديد وإعادة المحاولة
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return accountsAxios(originalRequest);
          }
        }
      } catch (refreshError) {
        // إذا فشل تجديد Token، نقوم بتسجيل الخروج
        console.error("❌ فشل تجديد Token:", refreshError);
        if (typeof window !== "undefined") {
          localStorage.removeItem("mediSmile_accessToken");
          localStorage.removeItem("mediSmile_refreshToken");
          localStorage.removeItem("mediSmile_currentUser");
          // إعادة توجيه لصفحة تسجيل الدخول
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // معالجة الأخطاء الأخرى
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "";
      
      // معالجة خطأ 401 (غير مصرح) - توجيه لصفحة تسجيل الدخول
      if (status === 401) {
        console.error("❌ خطأ 401 (غير مصرح) - يتم توجيهك لصفحة تسجيل الدخول");
        if (typeof window !== "undefined") {
          localStorage.removeItem("mediSmile_accessToken");
          localStorage.removeItem("mediSmile_refreshToken");
          localStorage.removeItem("mediSmile_currentUser");
          window.location.href = "/login";
        }
      }
      // 🔹 معالجة خاصة لخطأ 403 (عدم الصلاحية) - لا نعرضه كخطأ خطير
      else if (status === 403) {
        // فقط نعرض تحذير خفيف للأخطاء 403 المتوقعة
        if (url.includes("tech-support") || url.includes("university-admins")) {
          console.warn("⚠️ تحذير: المستخدم الحالي لا يملك صلاحية للوصول إلى:", url);
        } else {
          console.error("❌ خطأ 403 (عدم الصلاحية):", url);
          console.error("📋 تفاصيل الخطأ:", error.response.data);
        }
      } else {
        // للأخطاء الأخرى، نعرض تفاصيل كاملة
        console.error("❌ خطأ في الطلب:", status);
        console.error("📋 تفاصيل الخطأ:", error.response.data);
        console.error("🔗 URL:", url);
        if (error.config?.data) {
          console.error("📦 البيانات المرسلة:", error.config.data);
        }
      }
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

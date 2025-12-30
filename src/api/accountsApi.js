import accountsAxios from "./accountsAxios";

/**
 * 🔹 جلب قائمة المشرفين (الدعم التقني)
 * GET /api/accounts/supervisors/
 * @returns {Promise} Response data with status, message, and data array
 */
export const fetchSupervisors = async () => {
  try {
    const res = await accountsAxios.get("accounts/supervisors/");
    // Response structure: {status, message, data}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة المشرفين:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل مشرف واحد
 * GET /api/accounts/supervisors/<user_id>/
 * @param {string} userId - معرف المستخدم (UUID)
 * @returns {Promise} Response data with status, message, and data object
 */
export const getSupervisorDetails = async (userId) => {
  try {
    const res = await accountsAxios.get(`accounts/supervisors/${userId}/`);
    // Response structure: {status, message, data}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل المشرف:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إنشاء حساب مشرف جديد (الدعم التقني)
 * POST /api/accounts/supervisors/create/
 * @param {Object} data - بيانات المشرف الجديد
 * @param {string} data.username - اسم المستخدم (مطلوب)
 * @param {string} data.email - البريد الإلكتروني (مطلوب)
 * @param {string} data.password - كلمة المرور (مطلوب)
 * @param {string} data.password_confirm - تأكيد كلمة المرور (مطلوب)
 * @param {string} data.first_name - الاسم الأول (مطلوب)
 * @param {string} data.last_name - اسم العائلة (مطلوب)
 * @param {string} [data.university_id] - معرف الجامعة (اختياري)
 * @param {string} [data.department] - القسم (اختياري)
 * @param {string} [data.position] - المنصب (اختياري)
 * @param {string} [data.license_number] - رقم الرخصة (اختياري)
 * @returns {Promise} Response data with status, message, and data object
 */
export const createSupervisor = async (data) => {
  try {
    const res = await accountsAxios.post("accounts/supervisors/create/", data);
    // Response structure: {status, message, data}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء المشرف:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تحديث حساب مشرف (الدعم التقني)
 * PATCH /api/accounts/supervisors/<user_id>/update/
 * @param {string} userId - معرف المستخدم (UUID)
 * @param {Object} data - البيانات المراد تحديثها (تحديث جزئي)
 * @param {string} [data.phone_number] - رقم الهاتف
 * @param {string} [data.address] - العنوان
 * @param {string} [data.date_of_birth] - تاريخ الميلاد (YYYY-MM-DD)
 * @param {string} [data.gender] - الجنس (male/female)
 * @param {File} [data.profile_picture] - صورة الملف الشخصي
 * @param {string} [data.university] - معرف الجامعة (UUID)
 * @param {string} [data.department] - القسم
 * @param {string} [data.position] - المنصب
 * @param {string} [data.license_number] - رقم الرخصة
 * @returns {Promise} Response data with status, message, and data object
 */
export const updateSupervisor = async (userId, data) => {
  try {
    // استخدام PATCH للتحديث الجزئي (يمكن استخدام PUT للتحديث الكامل)
    const res = await accountsAxios.patch(`accounts/supervisors/${userId}/update/`, data);
    // Response structure: {status, message, data}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث المشرف:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 حذف حساب مشرف (الدعم التقني)
 * DELETE /api/accounts/supervisors/<user_id>/delete/
 * @param {string} userId - معرف المستخدم (UUID)
 * @returns {Promise} Response data with status, message, and data (null)
 */
export const deleteSupervisor = async (userId) => {
  try {
    const res = await accountsAxios.delete(`accounts/supervisors/${userId}/delete/`);
    // Response structure: {status, message, data: null}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في حذف المشرف:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب قائمة الطلاب
 * GET /api/accounts/students/
 * @returns {Promise} Response data with status, message، و data array
 */
export const fetchStudents = async () => {
  try {
    const res = await accountsAxios.get("accounts/students/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة الطلاب:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل طالب واحد
 * GET /api/accounts/students/<user_id>/
 * @param {string} userId - معرف المستخدم (UUID)
 * @returns {Promise} Response data with status, message، و data object
 */
export const getStudentDetails = async (userId) => {
  try {
    const res = await accountsAxios.get(`accounts/students/${userId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل الطالب:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إنشاء طالب جديد
 * POST /api/accounts/students/create/
 * @param {Object} data - بيانات الطالب الجديد
 */
export const createStudent = async (data) => {
  try {
    const res = await accountsAxios.post("accounts/students/create/", data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء الطالب:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تحديث بيانات طالب
 * PATCH /api/accounts/students/<user_id>/update/
 * @param {string} userId - معرف المستخدم (UUID)
 * @param {Object} data - البيانات المراد تحديثها
 */
export const updateStudent = async (userId, data) => {
  try {
    const res = await accountsAxios.patch(`accounts/students/${userId}/update/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث بيانات الطالب:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 حذف طالب
 * DELETE /api/accounts/students/<user_id>/delete/
 * @param {string} userId - معرف المستخدم (UUID)
 */
export const deleteStudent = async (userId) => {
  try {
    const res = await accountsAxios.delete(`accounts/students/${userId}/delete/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في حذف الطالب:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * 🔹 جلب قائمة مدراء الجامعات
 * GET /api/accounts/university/admins/all/
 */
export const fetchUniversityAdmins = async () => {
  try {
    const res = await accountsAxios.get("accounts/university/admins/all/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة مدراء الجامعات:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إنشاء مدير جامعة جديد
 * POST /api/accounts/create/university-admin/
 */
export const createUniversityAdmin = async (data) => {
  try {
    const res = await accountsAxios.post("accounts/create/university-admin/", data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء مدير الجامعة:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تحديث بيانات مدير جامعة
 * PATCH /api/university-admins/<user_id>/
 */
export const updateUniversityAdmin = async (userId, data) => {
  try {
    const res = await accountsAxios.patch(`university-admins/${userId}/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث مدير الجامعة:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * 🔹 جلب قائمة موظفي الدعم التقني
 * GET /api/accounts/system/tech-support/
 */
export const fetchTechSupport = async () => {
  try {
    const res = await accountsAxios.get("accounts/system/tech-support/");
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب قائمة الدعم التقني:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 جلب تفاصيل موظف دعم تقني واحد
 * GET /api/accounts/system/tech-support/<user_id>/
 */
export const getTechSupportDetails = async (userId) => {
  try {
    const res = await accountsAxios.get(`accounts/system/tech-support/${userId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في جلب تفاصيل الدعم التقني:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 إنشاء موظف دعم تقني جديد
 * POST /api/accounts/system/tech-support/create/
 */
export const createTechSupport = async (data) => {
  try {
    const res = await accountsAxios.post("accounts/system/tech-support/create/", data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء موظف الدعم التقني:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تحديث بيانات موظف دعم تقني
 * PATCH /api/accounts/system/tech-support/<user_id>/update/
 */
export const updateTechSupport = async (userId, data) => {
  try {
    const res = await accountsAxios.patch(`accounts/system/tech-support/${userId}/update/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث بيانات الدعم التقني:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 حذف موظف دعم تقني
 * DELETE /api/accounts/system/tech-support/<user_id>/delete/
 */
export const deleteTechSupport = async (userId) => {
  try {
    const res = await accountsAxios.delete(`accounts/system/tech-support/${userId}/delete/`);
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في حذف موظف الدعم التقني:", error.response?.data || error.message);
    throw error;
  }
};

/* ──────────── Authentication APIs ──────────── */

/**
 * 🔹 تسجيل الدخول
 * POST /api/accounts/login/tech-support/
 * @param {Object} credentials - بيانات تسجيل الدخول
 * @param {string} credentials.email - البريد الإلكتروني أو اسم المستخدم
 * @param {string} credentials.password - كلمة المرور
 * @returns {Promise} Response data with tokens and user info
 */
export const login = async (credentials) => {
  try {
    const res = await accountsAxios.post("accounts/login/tech-support/", credentials);
    // Response structure: {status, message, data: {tokens: {access, refresh}, user}}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تسجيل الدخول:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تسجيل الخروج
 * POST /api/accounts/logout/tech-support/
 * @param {string} refreshToken - Refresh token لإلغاء تفعيله
 * @returns {Promise} Response data with status and message
 */
export const logout = async (refreshToken) => {
  try {
    const res = await accountsAxios.post("accounts/logout/tech-support/", { refresh: refreshToken });
    // Response structure: {status, message} or {detail}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تسجيل الخروج:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 تجديد Access Token
 * POST /api/token/refresh/
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} Response data with new access token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const res = await accountsAxios.post("token/refresh/", { refresh: refreshToken });
    // Response structure: {access: "new_access_token"}
    return res.data;
  } catch (error) {
    console.error("❌ خطأ في تجديد Token:", error.response?.data || error.message);
    throw error;
  }
};


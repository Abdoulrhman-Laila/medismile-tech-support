import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountsAxios from "@/api/accountsAxios";
import {
  fetchSupervisors,
  getSupervisorDetails,
  createSupervisor,
  updateSupervisor,
  deleteSupervisor,
  fetchStudents as fetchStudentsApi,
  getStudentDetails as getStudentDetailsApi,
  createStudent as createStudentApi,
  updateStudent as updateStudentApi,
  deleteStudent as deleteStudentApi,
  fetchUniversityAdmins as fetchUniversityAdminsApi,
  getUniversityAdminDetails as getUniversityAdminDetailsApi,
  createUniversityAdmin as createUniversityAdminApi,
  updateUniversityAdmin as updateUniversityAdminApi,
  deleteUniversityAdmin as deleteUniversityAdminApi,
  fetchTechSupport as fetchTechSupportApi,
  getTechSupportDetails as getTechSupportDetailsApi,
  createTechSupport as createTechSupportApi,
  updateTechSupport as updateTechSupportApi,
  deleteTechSupport as deleteTechSupportApi,
} from "@/api/accountsApi";

const resolveEntityKey = (entity) => {
  if (!entity) return null;
  return (
    (entity.user_id !== undefined && entity.user_id !== null && entity.user_id !== "" && String(entity.user_id)) ||
    (entity.id !== undefined && entity.id !== null && entity.id !== "" && String(entity.id)) ||
    (entity.original_user_id !== undefined && entity.original_user_id !== null && entity.original_user_id !== "" && String(entity.original_user_id)) ||
    (entity.username !== undefined && entity.username !== null && entity.username !== "" && String(entity.username)) ||
    null
  );
};

const resolvePhoneNumber = (entity) => {
  if (!entity || typeof entity !== "object") return null;

  const extract = (...candidates) => {
    for (const value of candidates) {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return null;
  };

  const directPhone = extract(
    entity.phone_number,
    entity.phoneNumber,
    entity.phone,
    entity.mobile,
    entity.mobile_number,
    entity.contact_phone,
    entity.contact_number,
    entity.contact
  );
  if (directPhone) return directPhone;

  const profilePhone = extract(
    entity.profile?.phone_number,
    entity.profile?.phone,
    entity.profile?.mobile,
    entity.profile?.contact_phone,
    entity.profile?.contact_number
  );
  if (profilePhone) return profilePhone;

  const detailsPhone = extract(
    entity.details?.phone_number,
    entity.details?.phone,
    entity.details?.mobile,
    entity.details?.contact_phone,
    entity.details?.contact_number,
    entity.metadata?.phone_number,
    entity.metadata?.phone
  );
  if (detailsPhone) return detailsPhone;

  return null;
};

const initialState = {
  users: [],
  patients: [],
  students: [],
  universityAdmins: [],
  techSupport: [],
  loading: false,
  error: null,
  operationLoading: false, // للعمليات الفردية (create, update, delete, toggle)
  operationError: null,
};

/* ──────────── Thunks ──────────── */

// 🔹 جلب قائمة المشرفين
// GET /api/v1/accounts/supervisors/
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchSupervisors();
      // Response structure: {status, message, data}
      const responseData = apiResponse?.data || apiResponse || [];
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!Array.isArray(responseData)) {
        return [];
      }

      const normalizedData = await Promise.all(
        responseData.map(async (user) => {
          const originalUserId = user.user_id ?? user.id ?? null;
          const normalizedUserId = originalUserId ? String(originalUserId) : null;
          const hasValidUuid = normalizedUserId ? uuidRegex.test(normalizedUserId) : false;

          if (!hasValidUuid) {
            console.warn("⚠️ مستخدم بدون UUID صحيح (سيُعرض مع تحذير):", user);
          }

          const baseEntry = {
            ...user,
            user_id: normalizedUserId,
            id: normalizedUserId,
            original_user_id: originalUserId,
            has_valid_uuid: hasValidUuid,
            university_name: user.university_name ?? null,
          };

          let detailData = null;
          let department = user.department ?? user.profile?.department ?? null;
          let position = user.position ?? user.profile?.position ?? null;
          let phoneNumber = resolvePhoneNumber(user);

          const needsDetail =
            hasValidUuid &&
            normalizedUserId &&
            (department === null || position === null || phoneNumber === null);

          if (needsDetail) {
            try {
              const detailResponse = await getSupervisorDetails(normalizedUserId);
              detailData = detailResponse?.data || detailResponse || null;
              department = department ?? detailData?.department ?? null;
              position = position ?? detailData?.position ?? null;
              phoneNumber = phoneNumber ?? resolvePhoneNumber(detailData);
            } catch (detailError) {
              console.warn("⚠️ تعذر جلب تفاصيل المشرف:", normalizedUserId, detailError);
            }
          }

          if (detailData) {
            return {
              ...detailData,
              ...baseEntry,
              department,
              position,
              phone_number: phoneNumber ?? resolvePhoneNumber(baseEntry),
              university_name: detailData.university_name ?? baseEntry.university_name ?? null,
            };
          }

          return {
            ...baseEntry,
            department,
            position,
            phone_number: phoneNumber ?? resolvePhoneNumber(baseEntry),
          };
        })
      );

      return normalizedData;
    } catch (err) {
      // استخراج رسالة الخطأ من response structure
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "فشل في جلب قائمة المشرفين";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب تفاصيل مشرف واحد
// GET /api/v1/accounts/supervisors/<user_id>/
export const getAccountDetails = createAsyncThunk(
  "accounts/getAccountDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getSupervisorDetails(userId);
      // Response structure: {status, message, data}
      const responseData = apiResponse?.data || apiResponse;
      
      // ⚠️ مهم: يجب استخدام user_id (UUID) من الـ response فقط
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let responseUserId = responseData.user_id;
      
      // إذا لم يكن user_id موجوداً أو ليس UUID، نتحقق من id
      if (!responseUserId || !uuidRegex.test(responseUserId)) {
        if (responseData.id && uuidRegex.test(responseData.id)) {
          responseUserId = responseData.id;
        } else if (userId && uuidRegex.test(userId)) {
          // استخدام userId الممرر كمعامل إذا كان UUID
          responseUserId = userId;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }
      
      // ⚠️ مهم: SupervisorDetailSerializer يستخدم fields = '__all__'
      // لذلك يرجع جميع الحقول من SupervisorProfile بما فيها university (UUID من ForeignKey)
      // SupervisorProfile.university هو ForeignKey إلى University، لذلك سيكون UUID
      // تحويل البيانات لتطابق التنسيق المتوقع
      const normalizedData = {
        ...responseData,
        // استخدام UUID الحقيقي من الـ response فقط
        user_id: responseUserId,
        id: responseUserId, // استخدام نفس UUID
        // SupervisorDetailSerializer يرجع university (UUID من ForeignKey) و university_name
        // university هو UUID من ForeignKey في SupervisorProfile
        university: responseData.university || responseData.university_id || null,
        university_id: responseData.university || responseData.university_id || null,
        university_name: responseData.university_name || null,
      };
      
      return normalizedData;
    } catch (err) {
      // استخراج رسالة الخطأ من response structure
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "فشل في جلب تفاصيل المشرف";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 إنشاء مشرف جديد
// POST /api/v1/accounts/supervisors/create/
export const createAccount = createAsyncThunk(
  "accounts/createAccount",
  async (newUser, { rejectWithValue }) => {
    try {
      console.log("📤 إرسال بيانات الإنشاء:", newUser);
      const apiResponse = await createSupervisor(newUser);
      // Response structure: {status, message, data}
      const createdUser = apiResponse?.data || apiResponse;
      
      // التأكد من أن البيانات تم إرجاعها بشكل صحيح
      if (!createdUser) {
        throw new Error("لم يتم إرجاع البيانات من السيرفر");
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = createdUser.user_id ?? createdUser.id ?? createdUser.original_user_id ?? null;

      if (!userId) {
        throw new Error("لم يتم إرجاع معرف المستخدم من السيرفر");
      }

      userId = String(userId);

      if (!uuidRegex.test(userId)) {
        console.warn("⚠️ تم إنشاء مستخدم بمعرف غير UUID:", createdUser);
      }
      
      // ⚠️ مهم: SupervisorCreateSerializer يرجع User object فقط
      // للحصول على التفاصيل الكاملة (بما فيها university)، نحتاج لجلب التفاصيل
      // تحويل البيانات لتطابق التنسيق المتوقع
      const normalizedUser = {
        ...createdUser,
        // استخدام UUID الحقيقي من الـ response فقط
        user_id: userId,
        id: userId, // استخدام نفس UUID
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        // عند الإنشاء، الـ response لا يحتوي على university مباشرة
        // سنحتاج لجلب التفاصيل لاحقاً للحصول على university
        university: createdUser.university || createdUser.university_id,
        university_id: createdUser.university || createdUser.university_id,
      };
      
      console.log("✅ تم إنشاء الحساب بنجاح:", normalizedUser);
      return normalizedUser;
    } catch (err) {
      console.error("❌ تفاصيل الخطأ في createAccount:", err);
      console.error("📦 البيانات المرسلة:", newUser);
      console.error("📋 استجابة الخطأ:", err.response?.data);
      
      // محاولة استخراج رسالة خطأ أكثر تفصيلاً
      let errorMessage = "فشل في إضافة الحساب";
      
      if (err.response?.data) {
        // إذا كان الخطأ في صيغة JSON
        if (typeof err.response.data === 'object') {
          const errors = err.response.data;
          
          // محاولة استخراج رسائل الخطأ من الحقول
          if (errors.errors) {
            // إذا كان errors عبارة عن string (JSON stringified)
            try {
              const parsedErrors = typeof errors.errors === 'string' 
                ? JSON.parse(errors.errors.replace(/'/g, '"')) 
                : errors.errors;
              
              const errorMessages = [];
              Object.entries(parsedErrors).forEach(([field, messages]) => {
                if (Array.isArray(messages)) {
                  messages.forEach(msg => {
                    if (typeof msg === 'object' && msg.string) {
                      errorMessages.push(`${field}: ${msg.string}`);
                    } else if (typeof msg === 'string') {
                      errorMessages.push(`${field}: ${msg}`);
                    }
                  });
                } else if (typeof messages === 'string') {
                  errorMessages.push(`${field}: ${messages}`);
                }
              });
              errorMessage = errorMessages.length > 0 ? errorMessages.join('; ') : errors.message || errorMessage;
            } catch (parseError) {
              // إذا فشل parsing، استخدم errors.errors كما هو
              errorMessage = typeof errors.errors === 'string' ? errors.errors : JSON.stringify(errors.errors);
            }
          } else if (errors.non_field_errors) {
            errorMessage = Array.isArray(errors.non_field_errors) 
              ? errors.non_field_errors.join(', ') 
              : errors.non_field_errors;
          } else if (errors.detail) {
            errorMessage = errors.detail;
          } else if (errors.message) {
            errorMessage = errors.message;
          } else if (errors.error) {
            errorMessage = errors.error;
          } else {
            // جمع جميع أخطاء الحقول
            const fieldErrors = Object.entries(errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.map(m => typeof m === 'object' ? m.string || JSON.stringify(m) : m).join(', ')}`;
                }
                return `${field}: ${messages}`;
              })
              .join('; ');
            errorMessage = fieldErrors || JSON.stringify(errors);
          }
        } else {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تحديث حساب دعم تقني
// PATCH /api/v1/accounts/supervisors/<user_id>/update/
export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async ({ user_id, updatedData }, { rejectWithValue }) => {
    try {
      // استخدام PATCH للتحديث الجزئي (يمكن استخدام PUT للتحديث الكامل)
      const apiResponse = await updateSupervisor(user_id, updatedData);
      // Response structure: {status, message, data}
      const updatedUser = apiResponse?.data || apiResponse;
      
      // ⚠️ مهم: يجب استخدام user_id (UUID) من الـ response فقط
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedUser.user_id;
      
      // إذا لم يكن user_id موجوداً أو ليس UUID، نتحقق من id
      if (!userId || !uuidRegex.test(userId)) {
        if (updatedUser.id && uuidRegex.test(updatedUser.id)) {
          userId = updatedUser.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          // استخدام user_id الممرر كمعامل إذا كان UUID
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }
      
      // ⚠️ مهم: SupervisorUpdateSerializer يرجع SupervisorProfile object
      // SupervisorProfile.university هو ForeignKey (UUID) إلى University
      // تحويل البيانات لتطابق التنسيق المتوقع
      const normalizedUser = {
        ...updatedUser,
        // استخدام UUID الحقيقي من الـ response فقط
        user_id: userId,
        id: userId, // استخدام نفس UUID
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        // SupervisorUpdateSerializer يرجع university (UUID من ForeignKey) و university_name
        // university هو UUID من ForeignKey في SupervisorProfile
        university: updatedUser.university || updatedUser.university_id || null,
        university_id: updatedUser.university || updatedUser.university_id || null,
        university_name: updatedUser.university_name || null,
      };
      
      return normalizedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.detail ||
                          err.message || 
                          "فشل في تحديث الحساب";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تحديث بيانات مشرف
// PATCH /api/v1/accounts/supervisors/<user_id>/update/
export const updateAccountAsync = createAsyncThunk(
  "accounts/updateAccountAsync",
  async ({ user_id, data }, { rejectWithValue }) => {
    try {
      console.log("📤 إرسال بيانات التحديث:", { user_id, data });
      // استخدام PATCH للتحديث الجزئي (يمكن استخدام PUT للتحديث الكامل)
      const apiResponse = await updateSupervisor(user_id, data);
      // Response structure: {status, message, data}
      const updatedUser = apiResponse?.data || apiResponse;
      
      // ⚠️ مهم: يجب استخدام user_id (UUID) من الـ response فقط
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedUser.user_id;
      
      // إذا لم يكن user_id موجوداً أو ليس UUID، نتحقق من id
      if (!userId || !uuidRegex.test(userId)) {
        if (updatedUser.id && uuidRegex.test(updatedUser.id)) {
          userId = updatedUser.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          // استخدام user_id الممرر كمعامل إذا كان UUID
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }
      
      // ⚠️ مهم: SupervisorUpdateSerializer يرجع SupervisorProfile object
      // SupervisorProfile.university هو ForeignKey (UUID) إلى University
      // تحويل البيانات لتطابق التنسيق المتوقع
      const normalizedUser = {
        ...updatedUser,
        // استخدام UUID الحقيقي من الـ response فقط
        user_id: userId,
        id: userId, // استخدام نفس UUID
        original_user_id: userId,
        has_valid_uuid: true,
        // SupervisorUpdateSerializer يرجع university (UUID من ForeignKey) و university_name
        // university هو UUID من ForeignKey في SupervisorProfile
        university: updatedUser.university || updatedUser.university_id || null,
        university_id: updatedUser.university || updatedUser.university_id || null,
        university_name: updatedUser.university_name || null,
      };
      
      console.log("✅ تم تحديث الحساب بنجاح:", normalizedUser);
      return normalizedUser;
    } catch (error) {
      console.error("❌ خطأ في updateAccountAsync:", error.response?.data || error.message);
      // استخراج رسالة الخطأ من response structure
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "فشل في تحديث بيانات المشرف";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 حذف مشرف
// DELETE /api/v1/accounts/supervisors/<user_id>/delete/
export const deleteAccountAsync = createAsyncThunk(
  "accounts/deleteAccountAsync",
  async (user_id, { rejectWithValue }) => {
    try {
      console.log("🗑️ حذف المشرف:", user_id);
      await deleteSupervisor(user_id);
      console.log("✅ تم حذف المشرف بنجاح");
      return user_id;
    } catch (err) {
      console.error("❌ خطأ في حذف المشرف:", err.response?.data || err.message);
      // استخراج رسالة الخطأ من response structure
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.detail ||
                          err.message || 
                          "فشل في حذف المشرف";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تبديل الحالة (نشط / معطل)
// PATCH /api/v1/accounts/supervisors/<user_id>/update/
export const toggleStatusAsync = createAsyncThunk(
  "accounts/toggleStatusAsync",
  async ({ user_id, currentStatus }, { rejectWithValue }) => {
    try {
      // تبديل الحالة - نستخدم update endpoint مع is_active المعكوس
      const newStatus = !currentStatus;
      const apiResponse = await updateSupervisor(user_id, {
        is_active: newStatus,
      });
      // Response structure: {status, message, data}
      const updatedUser = apiResponse?.data || apiResponse;
      
      // ⚠️ مهم: يجب استخدام user_id (UUID) من الـ response فقط
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedUser.user_id;
      
      // إذا لم يكن user_id موجوداً أو ليس UUID، نتحقق من id
      if (!userId || !uuidRegex.test(userId)) {
        if (updatedUser.id && uuidRegex.test(updatedUser.id)) {
          userId = updatedUser.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          // استخدام user_id الممرر كمعامل إذا كان UUID
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }
      
      // ⚠️ مهم: SupervisorUpdateSerializer يرجع SupervisorProfile object
      // SupervisorProfile.university هو ForeignKey (UUID) إلى University
      // تحويل البيانات لتطابق التنسيق المتوقع
      const normalizedUser = {
        ...updatedUser,
        // استخدام UUID الحقيقي من الـ response فقط
        user_id: userId,
        id: userId, // استخدام نفس UUID
        original_user_id: userId,
        has_valid_uuid: true,
        // SupervisorUpdateSerializer يرجع university (UUID من ForeignKey) و university_name
        // university هو UUID من ForeignKey في SupervisorProfile
        university: updatedUser.university || updatedUser.university_id || null,
        university_id: updatedUser.university || updatedUser.university_id || null,
        university_name: updatedUser.university_name || null,
      };
      
      return normalizedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.detail ||
                          err.message || 
                          "فشل في تبديل الحالة";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── University Admins Thunks ──────────── */

// 🔹 جلب قائمة مدراء الجامعات
// GET /api/v1/accounts/university-admins/
export const fetchUniversityAdmins = createAsyncThunk(
  "accounts/fetchUniversityAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchUniversityAdminsApi();
      const responseData = apiResponse?.data || apiResponse || [];
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!Array.isArray(responseData)) {
        return [];
      }

      const normalizedAdmins = await Promise.all(
        responseData.map(async (admin) => {
          const originalUserId = admin.user_id ?? admin.id ?? null;
          const normalizedUserId = originalUserId ? String(originalUserId) : null;
          const hasValidUuid = normalizedUserId ? uuidRegex.test(normalizedUserId) : false;

          if (!hasValidUuid) {
            console.warn("⚠️ مدير جامعة بدون UUID صحيح (سيُعرض مع تحذير):", admin);
          }

          const baseEntry = {
            ...admin,
            user_id: normalizedUserId,
            id: normalizedUserId,
            original_user_id: originalUserId,
            has_valid_uuid: hasValidUuid,
            university_name: admin.university_name ?? null,
          };

          let detailData = null;
          let department = admin.department ?? admin.profile?.department ?? null;
          let position = admin.position ?? admin.profile?.position ?? null;
          let phoneNumber = resolvePhoneNumber(admin);

          const needsDetail =
            hasValidUuid &&
            normalizedUserId &&
            (department === null || position === null || phoneNumber === null || !baseEntry.university_name);

          if (needsDetail) {
            try {
              const detailResponse = await getUniversityAdminDetailsApi(normalizedUserId);
              detailData = detailResponse?.data || detailResponse || null;
              department = department ?? detailData?.department ?? null;
              position = position ?? detailData?.position ?? null;
              phoneNumber = phoneNumber ?? resolvePhoneNumber(detailData);
            } catch (detailError) {
              console.warn("⚠️ تعذر جلب تفاصيل مدير الجامعة:", normalizedUserId, detailError);
            }
          }

          if (detailData) {
            return {
              ...detailData,
              ...baseEntry,
              department,
              position,
              phone_number: phoneNumber ?? resolvePhoneNumber(baseEntry),
              university_name: detailData.university_name ?? baseEntry.university_name ?? null,
            };
          }

          return {
            ...baseEntry,
            department,
            position,
            phone_number: phoneNumber ?? resolvePhoneNumber(baseEntry),
          };
        })
      );

      return normalizedAdmins;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب قائمة مدراء الجامعات";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب تفاصيل مدير جامعة
// GET /api/v1/accounts/university-admins/<user_id>/
export const getUniversityAdminDetails = createAsyncThunk(
  "accounts/getUniversityAdminDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getUniversityAdminDetailsApi(userId);
      const responseData = apiResponse?.data || apiResponse;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      let responseUserId = responseData.user_id;
      if (!responseUserId || !uuidRegex.test(responseUserId)) {
        if (responseData.id && uuidRegex.test(responseData.id)) {
          responseUserId = responseData.id;
        } else if (userId && uuidRegex.test(userId)) {
          responseUserId = userId;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...responseData,
        user_id: responseUserId,
        id: responseUserId,
        original_user_id: responseUserId,
        has_valid_uuid: true,
        university: responseData.university || responseData.university_id || null,
        university_id: responseData.university || responseData.university_id || null,
        university_name: responseData.university_name || null,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب تفاصيل مدير الجامعة";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 إنشاء مدير جامعة جديد
// POST /api/v1/accounts/university-admins/create/
export const createUniversityAdmin = createAsyncThunk(
  "accounts/createUniversityAdmin",
  async (newAdmin, { rejectWithValue }) => {
    try {
      console.log("📤 إرسال بيانات إنشاء مدير الجامعة:", newAdmin);
      const apiResponse = await createUniversityAdminApi(newAdmin);
      const createdAdmin = apiResponse?.data || apiResponse;

      if (!createdAdmin) {
        throw new Error("لم يتم إرجاع البيانات من السيرفر");
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = createdAdmin.user_id ?? createdAdmin.id ?? createdAdmin.original_user_id ?? null;

      if (!userId) {
        throw new Error("لم يتم إرجاع معرف المستخدم من السيرفر");
      }

      userId = String(userId);

      if (!uuidRegex.test(userId)) {
        console.warn("⚠️ تم إنشاء مدير جامعة بمعرف غير UUID:", createdAdmin);
      }

      const normalizedAdmin = {
        ...createdAdmin,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        university: createdAdmin.university || createdAdmin.university_id || null,
        university_id: createdAdmin.university || createdAdmin.university_id || null,
      };

      console.log("✅ تم إنشاء مدير الجامعة بنجاح:", normalizedAdmin);
      return normalizedAdmin;
    } catch (err) {
      console.error("❌ تفاصيل الخطأ في createUniversityAdmin:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في إضافة مدير الجامعة";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تحديث بيانات مدير جامعة
// PATCH /api/v1/accounts/university-admins/<user_id>/update/
export const updateUniversityAdmin = createAsyncThunk(
  "accounts/updateUniversityAdmin",
  async ({ user_id, data }, { rejectWithValue }) => {
    try {
      const apiResponse = await updateUniversityAdminApi(user_id, data);
      const updatedAdmin = apiResponse?.data || apiResponse;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedAdmin.user_id;

      if (!userId || !uuidRegex.test(userId)) {
        if (updatedAdmin.id && uuidRegex.test(updatedAdmin.id)) {
          userId = updatedAdmin.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...updatedAdmin,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        university: updatedAdmin.university || updatedAdmin.university_id || null,
        university_id: updatedAdmin.university || updatedAdmin.university_id || null,
        university_name: updatedAdmin.university_name || null,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تحديث بيانات مدير الجامعة";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 حذف مدير جامعة
// DELETE /api/v1/accounts/university-admins/<user_id>/delete/
export const deleteUniversityAdmin = createAsyncThunk(
  "accounts/deleteUniversityAdmin",
  async (user_id, { rejectWithValue }) => {
    try {
      await deleteUniversityAdminApi(user_id);
      return user_id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في حذف مدير الجامعة";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── Tech Support Thunks ──────────── */

// 🔹 جلب قائمة موظفي الدعم التقني
export const fetchTechSupport = createAsyncThunk(
  "accounts/fetchTechSupport",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchTechSupportApi();
      const responseData = apiResponse?.data || apiResponse || [];
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!Array.isArray(responseData)) {
        return [];
      }

      const normalizedSupport = await Promise.all(
        responseData.map(async (tech) => {
          const originalUserId = tech.user_id ?? tech.id ?? null;
          const normalizedUserId = originalUserId ? String(originalUserId) : null;
          const hasValidUuid = normalizedUserId ? uuidRegex.test(normalizedUserId) : false;

          if (!hasValidUuid) {
            console.warn("⚠️ موظف دعم تقني بدون UUID صحيح (سيُعرض مع تحذير):", tech);
          }

          const baseEntry = {
            ...tech,
            user_id: normalizedUserId,
            id: normalizedUserId,
            original_user_id: originalUserId,
            has_valid_uuid: hasValidUuid,
            department: tech.department ?? null,
            position: tech.position ?? null,
          };

          let phoneNumber = resolvePhoneNumber(tech);
          let detailData = null;

          if (!phoneNumber && normalizedUserId && hasValidUuid) {
            try {
              const detailResponse = await getTechSupportDetailsApi(normalizedUserId);
              detailData = detailResponse?.data || detailResponse || null;
              phoneNumber = resolvePhoneNumber(detailData) ?? phoneNumber;
            } catch (detailError) {
              console.warn("⚠️ تعذر جلب تفاصيل موظف الدعم التقني:", normalizedUserId, detailError);
            }
          }

          if (detailData) {
            return {
              ...detailData,
              ...baseEntry,
              phone_number: phoneNumber ?? resolvePhoneNumber(baseEntry),
            };
          }

          return {
            ...baseEntry,
            phone_number: phoneNumber ?? resolvePhoneNumber(baseEntry),
          };
        })
      );

      return normalizedSupport;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب قائمة موظفي الدعم التقني";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب تفاصيل موظف دعم تقني
export const getTechSupportDetails = createAsyncThunk(
  "accounts/getTechSupportDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getTechSupportDetailsApi(userId);
      const responseData = apiResponse?.data || apiResponse;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      let responseUserId = responseData.user_id;
      if (!responseUserId || !uuidRegex.test(responseUserId)) {
        if (responseData.id && uuidRegex.test(responseData.id)) {
          responseUserId = responseData.id;
        } else if (userId && uuidRegex.test(userId)) {
          responseUserId = userId;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      const phoneNumber = resolvePhoneNumber(responseData);

      return {
        ...responseData,
        user_id: responseUserId,
        id: responseUserId,
        original_user_id: responseUserId,
        has_valid_uuid: true,
        department: responseData.department ?? null,
        position: responseData.position ?? null,
        phone_number: phoneNumber,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب تفاصيل موظف الدعم التقني";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 إنشاء موظف دعم تقني
export const createTechSupport = createAsyncThunk(
  "accounts/createTechSupport",
  async (newTechSupport, { rejectWithValue }) => {
    try {
      console.log("📤 إرسال بيانات إنشاء موظف الدعم التقني:", newTechSupport);
      const apiResponse = await createTechSupportApi(newTechSupport);
      const createdTechSupport = apiResponse?.data || apiResponse;

      if (!createdTechSupport) {
        throw new Error("لم يتم إرجاع البيانات من السيرفر");
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = createdTechSupport.user_id ?? createdTechSupport.id ?? createdTechSupport.original_user_id ?? null;

      if (!userId) {
        throw new Error("لم يتم إرجاع معرف المستخدم من السيرفر");
      }

      userId = String(userId);

      if (!uuidRegex.test(userId)) {
        console.warn("⚠️ تم إنشاء موظف دعم تقني بمعرف غير UUID:", createdTechSupport);
      }

      const phoneNumber = resolvePhoneNumber(createdTechSupport);

      const normalizedTechSupport = {
        ...createdTechSupport,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        department: createdTechSupport.department ?? null,
        position: createdTechSupport.position ?? null,
        phone_number: phoneNumber,
      };

      console.log("✅ تم إنشاء موظف الدعم التقني بنجاح:", normalizedTechSupport);
      return normalizedTechSupport;
    } catch (err) {
      console.error("❌ تفاصيل الخطأ في createTechSupport:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في إضافة موظف الدعم التقني";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تحديث بيانات موظف دعم تقني
export const updateTechSupport = createAsyncThunk(
  "accounts/updateTechSupport",
  async ({ user_id, data }, { rejectWithValue }) => {
    try {
      const apiResponse = await updateTechSupportApi(user_id, data);
      const updatedTechSupport = apiResponse?.data || apiResponse;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedTechSupport.user_id;

      if (!userId || !uuidRegex.test(userId)) {
        if (updatedTechSupport.id && uuidRegex.test(updatedTechSupport.id)) {
          userId = updatedTechSupport.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      const phoneNumber = resolvePhoneNumber(updatedTechSupport);

      return {
        ...updatedTechSupport,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        department: updatedTechSupport.department ?? null,
        position: updatedTechSupport.position ?? null,
        phone_number: phoneNumber,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تحديث بيانات موظف الدعم التقني";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 حذف موظف دعم تقني
export const deleteTechSupport = createAsyncThunk(
  "accounts/deleteTechSupport",
  async (user_id, { rejectWithValue }) => {
    try {
      await deleteTechSupportApi(user_id);
      return user_id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في حذف موظف الدعم التقني";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── Students Thunks ──────────── */

// 🔹 جلب قائمة الطلاب
// GET /api/v1/accounts/students/
export const fetchStudents = createAsyncThunk(
  "accounts/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await fetchStudentsApi();
      const responseData = apiResponse?.data || apiResponse || [];
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const normalizedStudents = Array.isArray(responseData)
        ? responseData.map((student) => {
            const originalUserId = student.user_id ?? student.id ?? null;
            const normalizedUserId = originalUserId ? String(originalUserId) : null;
            const hasValidUuid = normalizedUserId ? uuidRegex.test(normalizedUserId) : false;

            if (!hasValidUuid) {
              console.warn("⚠️ طالب بدون UUID صحيح (سيُعرض مع تحذير):", student);
            }

            return {
              ...student,
              user_id: normalizedUserId,
              id: normalizedUserId,
              original_user_id: originalUserId,
              has_valid_uuid: hasValidUuid,
              university_name: student.university_name ?? null,
            };
          })
        : [];

      return normalizedStudents;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب قائمة الطلاب";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب تفاصيل طالب واحد
// GET /api/v1/accounts/students/<user_id>/
export const getStudentDetails = createAsyncThunk(
  "accounts/getStudentDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getStudentDetailsApi(userId);
      const responseData = apiResponse?.data || apiResponse;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      let responseUserId = responseData.user_id;
      if (!responseUserId || !uuidRegex.test(responseUserId)) {
        if (responseData.id && uuidRegex.test(responseData.id)) {
          responseUserId = responseData.id;
        } else if (userId && uuidRegex.test(userId)) {
          responseUserId = userId;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...responseData,
        user_id: responseUserId,
        id: responseUserId,
        original_user_id: responseUserId,
        has_valid_uuid: true,
        university: responseData.university || responseData.university_id || null,
        university_id: responseData.university || responseData.university_id || null,
        university_name: responseData.university_name || null,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب تفاصيل الطالب";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 إنشاء طالب جديد
// POST /api/v1/accounts/students/create/
export const createStudent = createAsyncThunk(
  "accounts/createStudent",
  async (newStudent, { rejectWithValue }) => {
    try {
      console.log("📤 إرسال بيانات إنشاء الطالب:", newStudent);
      const apiResponse = await createStudentApi(newStudent);
      const createdStudent = apiResponse?.data || apiResponse;

      if (!createdStudent) {
        throw new Error("لم يتم إرجاع البيانات من السيرفر");
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = createdStudent.user_id ?? createdStudent.id ?? createdStudent.original_user_id ?? null;

      if (!userId) {
        throw new Error("لم يتم إرجاع معرف المستخدم من السيرفر");
      }

      userId = String(userId);

      if (!uuidRegex.test(userId)) {
        console.warn("⚠️ تم إنشاء طالب بمعرف غير UUID:", createdStudent);
      }

      const normalizedStudent = {
        ...createdStudent,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        university: createdStudent.university || createdStudent.university_id || null,
        university_id: createdStudent.university || createdStudent.university_id || null,
      };

      console.log("✅ تم إنشاء الطالب بنجاح:", normalizedStudent);
      return normalizedStudent;
    } catch (err) {
      console.error("❌ تفاصيل الخطأ في createStudent:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في إضافة الطالب";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تحديث بيانات طالب
// PATCH /api/v1/accounts/students/<user_id>/update/
export const updateStudent = createAsyncThunk(
  "accounts/updateStudent",
  async ({ user_id, data }, { rejectWithValue }) => {
    try {
      const apiResponse = await updateStudentApi(user_id, data);
      const updatedStudent = apiResponse?.data || apiResponse;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedStudent.user_id;

      if (!userId || !uuidRegex.test(userId)) {
        if (updatedStudent.id && uuidRegex.test(updatedStudent.id)) {
          userId = updatedStudent.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...updatedStudent,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: uuidRegex.test(userId),
        university: updatedStudent.university || updatedStudent.university_id || null,
        university_id: updatedStudent.university || updatedStudent.university_id || null,
        university_name: updatedStudent.university_name || null,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تحديث بيانات الطالب";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 حذف طالب
// DELETE /api/v1/accounts/students/<user_id>/delete/
export const deleteStudent = createAsyncThunk(
  "accounts/deleteStudent",
  async (user_id, { rejectWithValue }) => {
    try {
      await deleteStudentApi(user_id);
      return user_id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في حذف الطالب";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── Patients Thunks ──────────── */

// 🔹 جلب قائمة المرضى
// GET /api/v1/accounts/patients/
export const fetchPatients = createAsyncThunk(
  "accounts/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await accountsAxios.get("accounts/patients/");
      const responseData = res.data?.data || res.data || [];
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const normalizedPatients = Array.isArray(responseData)
        ? responseData.map((patient) => {
            const originalUserId = patient.user_id ?? patient.id ?? null;
            const normalizedUserId = originalUserId ? String(originalUserId) : null;
            const hasValidUuid = normalizedUserId ? uuidRegex.test(normalizedUserId) : false;

            if (!hasValidUuid) {
              console.warn("⚠️ مريض بدون UUID صحيح (سيُعرض مع تحذير):", patient);
            }

            return {
              ...patient,
              user_id: normalizedUserId,
              id: normalizedUserId,
              original_user_id: originalUserId,
              has_valid_uuid: hasValidUuid,
            };
          })
        : [];

      return normalizedPatients;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب قائمة المرضى";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 جلب تفاصيل مريض واحد
// GET /api/v1/accounts/patients/<user_id>/
export const getPatientDetails = createAsyncThunk(
  "accounts/getPatientDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await accountsAxios.get(`accounts/patients/${userId}/`);
      const responseData = res.data?.data || res.data;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      let responseUserId = responseData.user_id;
      if (!responseUserId || !uuidRegex.test(responseUserId)) {
        if (responseData.id && uuidRegex.test(responseData.id)) {
          responseUserId = responseData.id;
        } else if (userId && uuidRegex.test(userId)) {
          responseUserId = userId;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...responseData,
        user_id: responseUserId,
        id: responseUserId,
        original_user_id: responseUserId,
        has_valid_uuid: true,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "فشل في جلب تفاصيل المريض";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 إنشاء مريض جديد
// POST /api/v1/accounts/patients/create/
export const createPatient = createAsyncThunk(
  "accounts/createPatient",
  async (newPatient, { rejectWithValue }) => {
    try {
      const res = await accountsAxios.post("accounts/patients/create/", newPatient);
      const createdPatient = res.data?.data || res.data;

      if (!createdPatient) {
        throw new Error("لم يتم إرجاع البيانات من السيرفر");
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = createdPatient.user_id;

      if (!userId || !uuidRegex.test(userId)) {
        if (createdPatient.id && uuidRegex.test(createdPatient.id)) {
          userId = createdPatient.id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...createdPatient,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: true,
      };
    } catch (err) {
      console.error("❌ تفاصيل الخطأ في createPatient:", err);
      console.error("📦 البيانات المرسلة:", newPatient);
      console.error("📋 استجابة الخطأ:", err.response?.data);

      let errorMessage = "فشل في إضافة المريض";

      const serverData = err.response?.data;
      if (serverData) {
        if (typeof serverData === "string") {
          errorMessage = serverData;
        } else if (serverData.message || serverData.error || serverData.detail) {
          errorMessage = serverData.message || serverData.error || serverData.detail;
        } else if (serverData.errors) {
          try {
            const parsed = typeof serverData.errors === "string"
              ? JSON.parse(serverData.errors.replace(/'/g, '"'))
              : serverData.errors;
            const messages = [];
            Object.entries(parsed || {}).forEach(([field, msgs]) => {
              if (Array.isArray(msgs)) {
                msgs.forEach((msg) => {
                  if (typeof msg === "object" && msg.string) {
                    messages.push(`${field}: ${msg.string}`);
                  } else {
                    messages.push(`${field}: ${msg}`);
                  }
                });
              } else {
                messages.push(`${field}: ${msgs}`);
              }
            });
            if (messages.length) {
              errorMessage = messages.join("; ");
            }
          } catch (parseErr) {
            console.warn("⚠️ فشل تفكيك رسائل الخطأ:", parseErr);
            errorMessage = typeof serverData.errors === "string" ? serverData.errors : JSON.stringify(serverData.errors);
          }
        } else {
          const messages = Object.entries(serverData)
            .map(([field, msgs]) => {
              if (Array.isArray(msgs)) {
                return `${field}: ${msgs.join(", ")}`;
              }
              if (typeof msgs === "object") {
                try {
                  return `${field}: ${JSON.stringify(msgs)}`;
                } catch (e) {
                  return `${field}: ${String(msgs)}`;
                }
              }
              return `${field}: ${msgs}`;
            });
          if (messages.length) {
            errorMessage = messages.join("; ");
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 تحديث بيانات مريض
// PATCH /api/v1/accounts/patients/<user_id>/update/
export const updatePatient = createAsyncThunk(
  "accounts/updatePatient",
  async ({ user_id, data }, { rejectWithValue }) => {
    try {
      const res = await accountsAxios.patch(`accounts/patients/${user_id}/update/`, data);
      const updatedPatient = res.data?.data || res.data;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let userId = updatedPatient.user_id;

      if (!userId || !uuidRegex.test(userId)) {
        if (updatedPatient.id && uuidRegex.test(updatedPatient.id)) {
          userId = updatedPatient.id;
        } else if (user_id && uuidRegex.test(user_id)) {
          userId = user_id;
        } else {
          throw new Error("لم يتم إرجاع UUID صحيح من السيرفر");
        }
      }

      return {
        ...updatedPatient,
        user_id: userId,
        id: userId,
        original_user_id: userId,
        has_valid_uuid: true,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في تحديث بيانات المريض";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 حذف مريض
// DELETE /api/v1/accounts/patients/<user_id>/delete/
export const deletePatient = createAsyncThunk(
  "accounts/deletePatient",
  async (user_id, { rejectWithValue }) => {
    try {
      await accountsAxios.delete(`accounts/patients/${user_id}/delete/`);
      return user_id;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "فشل في حذف المريض";
      return rejectWithValue(errorMessage);
    }
  }
);

/* ──────────── Slice ──────────── */

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    loadFromStorage: (state) => {
      const saved = localStorage.getItem("accounts");
      if (saved) state.users = JSON.parse(saved);
    },
    clearError: (state) => {
      state.error = null;
      state.operationError = null;
    },
    clearOperationError: (state) => {
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Fetch
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get Details
      .addCase(getAccountDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getAccountDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        // تحديث المستخدم في القائمة إذا كان موجوداً، أو إضافته
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.users.findIndex((u) => resolveEntityKey(u) === payloadKey);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(getAccountDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Create
      .addCase(createAccount.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const rawId = action.payload.user_id ?? action.payload.id ?? action.payload.original_user_id ?? null;
        const userId = rawId ? String(rawId) : null;
        const hasValidUuid = userId ? uuidRegex.test(userId) : false;

        const newUser = {
          ...action.payload,
          user_id: userId,
          id: userId,
          original_user_id: action.payload.original_user_id ?? userId ?? action.payload.username ?? null,
          has_valid_uuid: hasValidUuid,
          university: action.payload.university_id || action.payload.university,
        };

        const lookupKey = resolveEntityKey(newUser);
        const exists = state.users.findIndex((u) => resolveEntityKey(u) === lookupKey);
        if (exists === -1) {
          state.users.push(newUser);
        } else {
          state.users[exists] = newUser;
        }
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update
      .addCase(updateAccount.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.users.findIndex((u) => resolveEntityKey(u) === payloadKey);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update Async
      .addCase(updateAccountAsync.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateAccountAsync.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.users.findIndex((u) => resolveEntityKey(u) === payloadKey);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateAccountAsync.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Delete
      .addCase(deleteAccountAsync.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteAccountAsync.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        // action.payload هو user_id (UUID) الذي تم حذفه
        const deletedUserId = action.payload;
        state.users = state.users.filter((u) => resolveEntityKey(u) !== String(deletedUserId));
      })
      .addCase(deleteAccountAsync.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Toggle status
      .addCase(toggleStatusAsync.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(toggleStatusAsync.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.users.findIndex((u) => resolveEntityKey(u) === payloadKey);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleStatusAsync.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get Student Details
      .addCase(getStudentDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getStudentDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.students.findIndex((s) => resolveEntityKey(s) === payloadKey);
        if (index !== -1) {
          state.students[index] = action.payload;
        } else {
          state.students.push(action.payload);
        }
      })
      .addCase(getStudentDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Create Student
      .addCase(createStudent.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.students.findIndex((s) => resolveEntityKey(s) === payloadKey);
        if (index === -1) {
          state.students.push(action.payload);
        } else {
          state.students[index] = action.payload;
        }
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update Student
      .addCase(updateStudent.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.students.findIndex((s) => resolveEntityKey(s) === payloadKey);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const deletedUserId = action.payload;
        state.students = state.students.filter((s) => resolveEntityKey(s) !== String(deletedUserId));
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Fetch University Admins
      .addCase(fetchUniversityAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversityAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.universityAdmins = action.payload;
      })
      .addCase(fetchUniversityAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get University Admin Details
      .addCase(getUniversityAdminDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getUniversityAdminDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.universityAdmins.findIndex((a) => resolveEntityKey(a) === payloadKey);
        if (index !== -1) {
          state.universityAdmins[index] = action.payload;
        } else {
          state.universityAdmins.push(action.payload);
        }
      })
      .addCase(getUniversityAdminDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Create University Admin
      .addCase(createUniversityAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createUniversityAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.universityAdmins.findIndex((a) => resolveEntityKey(a) === payloadKey);
        if (index === -1) {
          state.universityAdmins.push(action.payload);
        } else {
          state.universityAdmins[index] = action.payload;
        }
      })
      .addCase(createUniversityAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update University Admin
      .addCase(updateUniversityAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateUniversityAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.universityAdmins.findIndex((a) => resolveEntityKey(a) === payloadKey);
        if (index !== -1) {
          state.universityAdmins[index] = action.payload;
        }
      })
      .addCase(updateUniversityAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Delete University Admin
      .addCase(deleteUniversityAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteUniversityAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const deletedUserId = action.payload;
        state.universityAdmins = state.universityAdmins.filter(
          (a) => resolveEntityKey(a) !== String(deletedUserId)
        );
      })
      .addCase(deleteUniversityAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Fetch Tech Support
      .addCase(fetchTechSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechSupport.fulfilled, (state, action) => {
        state.loading = false;
        const existingMap = new Map(
          (state.techSupport || []).map((entry) => [resolveEntityKey(entry), entry])
        );
        state.techSupport = action.payload.map((entry) => {
          const key = resolveEntityKey(entry);
          const existing = existingMap.get(key);
        const resolvedPhone = resolvePhoneNumber(entry) ?? resolvePhoneNumber(existing);
          return { ...existing, ...entry, phone_number: resolvedPhone };
        });
      })
      .addCase(fetchTechSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get Tech Support Details
      .addCase(getTechSupportDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getTechSupportDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.techSupport.findIndex((t) => resolveEntityKey(t) === payloadKey);
        if (index !== -1) {
          state.techSupport[index] = action.payload;
        } else {
          state.techSupport.push(action.payload);
        }
      })
      .addCase(getTechSupportDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Create Tech Support
      .addCase(createTechSupport.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createTechSupport.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.techSupport.findIndex((t) => resolveEntityKey(t) === payloadKey);
        const existingEntry = index !== -1 ? state.techSupport[index] : null;
        const resolvedPhone =
          resolvePhoneNumber(action.payload) ??
          resolvePhoneNumber(existingEntry);
        const payloadWithPhone = { ...existingEntry, ...action.payload, phone_number: resolvedPhone };
        if (index === -1) {
          state.techSupport.push(payloadWithPhone);
        } else {
          state.techSupport[index] = payloadWithPhone;
        }
      })
      .addCase(createTechSupport.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update Tech Support
      .addCase(updateTechSupport.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateTechSupport.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.techSupport.findIndex((t) => resolveEntityKey(t) === payloadKey);
        if (index !== -1) {
          const existingEntry = state.techSupport[index];
          const resolvedPhone =
            resolvePhoneNumber(action.payload) ??
            resolvePhoneNumber(existingEntry);
          state.techSupport[index] = { ...existingEntry, ...action.payload, phone_number: resolvedPhone };
        }
      })
      .addCase(updateTechSupport.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Delete Tech Support
      .addCase(deleteTechSupport.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteTechSupport.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const deletedUserId = action.payload;
        state.techSupport = state.techSupport.filter((t) => resolveEntityKey(t) !== String(deletedUserId));
      })
      .addCase(deleteTechSupport.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔸 Get Patient Details
      .addCase(getPatientDetails.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(getPatientDetails.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.patients.findIndex((p) => resolveEntityKey(p) === payloadKey);
        if (index !== -1) {
          state.patients[index] = action.payload;
        } else {
          state.patients.push(action.payload);
        }
      })
      .addCase(getPatientDetails.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Create Patient
      .addCase(createPatient.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.patients.findIndex((p) => resolveEntityKey(p) === payloadKey);
        if (index === -1) {
          state.patients.push(action.payload);
        } else {
          state.patients[index] = action.payload;
        }
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const payloadKey = resolveEntityKey(action.payload);
        const index = state.patients.findIndex((p) => resolveEntityKey(p) === payloadKey);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // 🔸 Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        const deletedUserId = action.payload;
        state.patients = state.patients.filter((p) => resolveEntityKey(p) !== String(deletedUserId));
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { loadFromStorage, clearError, clearOperationError } = accountsSlice.actions;
export default accountsSlice.reducer;

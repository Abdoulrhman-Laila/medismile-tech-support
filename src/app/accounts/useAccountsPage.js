"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  createUniversityAdmin,
  updateUniversityAdmin,
  fetchUniversityAdmins,
} from "@/redux/slices/accountsSlice";
import { fetchUniversities } from "@/redux/slices/universitiesSlice";
import {
  addActionLabels,
  getInitialFormData,
  normalizeUniversityId,
  roleLabels,
  sanitizeValue,
  stripPayload,
  uuidRegex,
} from "./utils";

export default function useAccountsPage() {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    operationLoading,
    operationError,
    universityAdmins,
  } = useSelector((state) => state.accounts);
  const { universities } = useSelector((state) => state.universities);

  const [activeRole, setActiveRole] = useState("university_admin");
  const [formData, setFormData] = useState(() => getInitialFormData("university_admin"));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 🔹 جلب قائمة الجامعات ومدراء الجامعات
    dispatch(fetchUniversities());
    dispatch(fetchUniversityAdmins());
  }, [dispatch]);

  useEffect(() => {
    setFormData(getInitialFormData(activeRole));
    setIsEditing(false);
    dispatch(clearError());
  }, [activeRole, dispatch]);

  // 🔹 جلب مدراء الجامعات للعرض
  const displayedUsers = useMemo(() => {
    if (activeRole === "university_admin") {
      return Array.isArray(universityAdmins) ? universityAdmins : [];
    }
    return [];
  }, [activeRole, universityAdmins]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "university" && value) {
      const normalized = normalizeUniversityId(value, universities);
      setFormData({ ...formData, [name]: normalized || "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const resetFormState = (role = activeRole) => {
    setFormData(getInitialFormData(role));
    setIsEditing(false);
    dispatch(clearError());
  };


  const submitUniversityAdmin = async () => {
    const userIdCandidate = formData.user_id || formData.id;
    const normalizedUniversityId = normalizeUniversityId(formData.university, universities);

    const baseUpdateFields = {
      first_name: sanitizeValue(formData.first_name),
      last_name: sanitizeValue(formData.last_name),
      phone_number: sanitizeValue(formData.phone_number),
      address: sanitizeValue(formData.address),
      date_of_birth: sanitizeValue(formData.date_of_birth),
      gender: sanitizeValue(formData.gender),
      profile_picture: sanitizeValue(formData.profile_picture),
      university: normalizedUniversityId,
      department: sanitizeValue(formData.department),
      position: sanitizeValue(formData.position),
    };

    if (isEditing) {
      if (!userIdCandidate) {
        alert("❌ لا يوجد ID للحساب المحدد للتعديل");
        return;
      }

      const userId = String(userIdCandidate);
      const updatePayload = stripPayload(baseUpdateFields, { preserveNull: true });

      try {
        const result = await dispatch(updateUniversityAdmin({ user_id: userId, data: updatePayload }));
        if (result.type === "accounts/updateUniversityAdmin/fulfilled") {
          // 🔹 إعادة جلب قائمة مدراء الجامعات بعد التحديث
          await dispatch(fetchUniversityAdmins());
          resetFormState("university_admin");
          alert("✅ تم تحديث بيانات مدير الجامعة بنجاح");
        } else if (result.type === "accounts/updateUniversityAdmin/rejected") {
          alert(`❌ فشل التحديث: ${result.payload}`);
        }
      } catch (err) {
        alert(`❌ خطأ في التحديث: ${err.message}`);
      }
      return;
    }

    // 🔹 الحقول المطلوبة: email, username, first_name, last_name, password, password_confirm, university_id
    if (!normalizedUniversityId) {
      alert("❌ يرجى اختيار الجامعة");
      return;
    }

    const createPayload = stripPayload(
      {
        email: formData.email?.trim(),
        username: formData.username?.trim(),
        first_name: sanitizeValue(formData.first_name),
        last_name: sanitizeValue(formData.last_name),
        password: formData.password,
        password_confirm: formData.password_confirm || formData.password,
        university_id: normalizedUniversityId, // إرسال university_id مباشرة عند الإنشاء
      },
      { preserveNull: false }
    );

    // 🔹 طباعة البيانات المرسلة للتحقق من university_id
    console.log("📤 البيانات المرسلة لإنشاء مدير جامعة:", JSON.stringify(createPayload, null, 2));
    console.log("🔍 معرف الجامعة المُرسل:", normalizedUniversityId);

    // 🔹 الحقول الإضافية التي سيتم إرسالها في تحديث منفصل بعد الإنشاء (إذا لزم الأمر)
    const updateFieldsAfterCreate = stripPayload({
      phone_number: sanitizeValue(formData.phone_number),
      address: sanitizeValue(formData.address),
      date_of_birth: sanitizeValue(formData.date_of_birth),
      gender: sanitizeValue(formData.gender),
      profile_picture: sanitizeValue(formData.profile_picture),
      department: sanitizeValue(formData.department),
      position: sanitizeValue(formData.position),
    }, { preserveNull: false });

    try {
      const result = await dispatch(createUniversityAdmin(createPayload));
      if (result.type === "accounts/createUniversityAdmin/fulfilled") {
        const createdAdmin = result.payload;
        
        // 🔹 الحصول على معرف المستخدم من الاستجابة
        // Redux slice يقوم بـ normalize البيانات ويعيد user_id, id, original_user_id
        const createdAdminId =
          createdAdmin?.user_id || 
          createdAdmin?.id || 
          createdAdmin?.original_user_id ||
          null;

        // 🔹 طباعة معرف المستخدم المرجع من السيرفر
        console.log("📥 استجابة السيرفر بعد إنشاء مدير الجامعة:", JSON.stringify(createdAdmin, null, 2));
        console.log("🆔 معرف المستخدم المرجع من السيرفر:", createdAdminId);

        if (!createdAdminId) {
          console.error("❌ تحذير: لم يتم إرجاع معرف المستخدم من السيرفر!");
          alert("⚠️ تم إنشاء مدير الجامعة لكن لم يتم إرجاع معرف المستخدم من السيرفر");
        }

        // 🔹 تحديث البيانات الإضافية (department, position, phone_number, etc.) بعد الإنشاء
        if (createdAdminId && Object.keys(updateFieldsAfterCreate).length > 0) {
          try {
            await dispatch(
              updateUniversityAdmin({ user_id: String(createdAdminId), data: updateFieldsAfterCreate })
            );
          } catch (error) {
            console.error("❌ خطأ في تحديث البيانات الإضافية لمدير الجامعة:", error);
            // نستمر حتى لو فشل التحديث - المستخدم تم إنشاؤه بنجاح
          }
        }
        // 🔹 إعادة جلب قائمة مدراء الجامعات بعد الإنشاء
        await dispatch(fetchUniversityAdmins());
        alert("✅ تم إنشاء مدير الجامعة بنجاح");
        resetFormState("university_admin");
      } else if (result.type === "accounts/createUniversityAdmin/rejected") {
        alert(`❌ فشل الإنشاء: ${result.payload}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الإنشاء: ${err.message}`);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEditing && formData.password !== formData.password_confirm) {
      alert("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    if (!isEditing) {
      const passwordPolicy = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordPolicy.test(formData.password || "")) {
        alert("⚠️ كلمة المرور يجب أن لا تقل عن 8 أحرف وتحتوي على حرف كبير ورقم ورمز.");
        return;
      }
      // التحقق من التكرار يتم في السيرفر
    }

    if (activeRole === "university_admin") {
      submitUniversityAdmin();
    }
  };

  const handleEdit = async (user) => {
    // لا يمكن التعديل حالياً لأن API جلب التفاصيل غير متوفر
    alert("⚠️ التعديل غير متوفر حالياً");
  };

  const handleDelete = (user) => {
    // لا يمكن الحذف حالياً لأن API الحذف غير متوفر
    alert("⚠️ الحذف غير متوفر حالياً");
  };

  const handleCancel = () => {
    resetFormState();
  };

  return {
    activeRole,
    setActiveRole,
    formData,
    setFormData,
    isEditing,
    loading,
    error,
    operationLoading,
    operationError,
    displayedUsers,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    roleLabels,
    addActionLabels,
    universities,
    uuidRegex,
  };
}


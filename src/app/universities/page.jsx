"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUniversities,
  createUniversity,
  updateUniversityAsync,
  deleteUniversityAsync,
  clearError,
  getUniversityDetails,
} from "@/redux/slices/universitiesSlice";
import {
  fetchCoursesByUniversity,
  createCourse,
  updateCourseAsync,
  deleteCourseAsync,
  clearError as clearCoursesError,
  setSelectedUniversity,
  clearCourses,
} from "@/redux/slices/coursesSlice";
import { Button, Card, PageHeader } from "@/components/ui";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle2,
  XCircle,
  University,
} from "lucide-react";

export default function UniversitiesPage() {
  const dispatch = useDispatch();
  const { universities, loading, error } = useSelector(
    (state) => state.universities
  );
  const { courses, loading: coursesLoading, error: coursesError } = useSelector(
    (state) => state.courses
  );

  const [showForm, setShowForm] = useState(false);
  const [editUni, setEditUni] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    website: "",
    email: "",
    phone: "",
    is_active: true,
  });
  
  // 🔹 حالات المقررات
  const [showCourses, setShowCourses] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedUniForCourses, setSelectedUniForCourses] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    code: "",
    level: "",
    duration_years: "",
    is_active: true,
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 🔹 جلب قائمة الجامعات عند تحميل الصفحة
  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  // 🔹 عرض رسالة الخطأ لمدة 5 ثوان
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

// page.jsx - داخل دالة handleSave

const handleSave = async () => {
    try {
      let universityId;
      if (editUni) {
        // تحديث جامعة موجودة
        const result = await dispatch(
          updateUniversityAsync({ id: editUni.id, data: formData })
        ).unwrap();
        universityId = editUni.id;
      } else {
        // إنشاء جامعة جديدة
        const result = await dispatch(createUniversity(formData)).unwrap();
        // 🔹 الحصول على ID الجامعة الجديدة
        universityId = result?.data?.id || result?.id;
      }
      
      // 🔹 إعادة جلب جميع البيانات من API لضمان الحصول على جميع الحقول
      // 💡 الأهم: يجب انتظار اكتمال هذا الإجراء قبل مسح النموذج!
      await dispatch(fetchUniversities());
      
      // ⬅️ تم نقل هذا الكود إلى هنا **بعد** await dispatch(fetchUniversities())
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        country: "",
        website: "",
        email: "",
        phone: "",
        is_active: true,
      });
      setEditUni(null);
      setShowForm(false);
      
    } catch (error) {
      console.error("فشل في حفظ الجامعة:", error);
    }
};

// ...

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذه الجامعة؟")) {
      try {
        await dispatch(deleteUniversityAsync(id)).unwrap();
      } catch (error) {
        console.error("فشل في حذف الجامعة:", error);
      }
    }
  };

  // 🔹 وظائف المقررات
  const handleShowCourses = async (university) => {
    setSelectedUniForCourses(university);
    setShowCourses(true);
    dispatch(setSelectedUniversity(university.id));
    try {
      await dispatch(fetchCoursesByUniversity(university.id));
    } catch (error) {
      console.error("فشل في جلب المقررات:", error);
    }
  };

  const handleCloseCourses = () => {
    setShowCourses(false);
    setSelectedUniForCourses(null);
    dispatch(clearCourses());
  };

  const handleCourseSave = async (e) => {
    e.preventDefault();
    try {
      // 🔹 تحويل duration_years إلى رقم
      const dataToSend = {
        ...courseFormData,
        duration_years: courseFormData.duration_years ? Number(courseFormData.duration_years) : null,
      };
      
      if (editCourse) {
        const result = await dispatch(
          updateCourseAsync({ 
            id: editCourse.id, 
            data: {
              ...dataToSend,
              university: selectedUniForCourses.id
            }
          })
        ).unwrap();
      } else {
        await dispatch(
          createCourse({
            universityId: selectedUniForCourses.id,
            courseData: dataToSend,
          })
        ).unwrap();
      }
      setCourseFormData({
        name: "",
        code: "",
        level: "",
        duration_years: "",
        is_active: true,
      });
      setEditCourse(null);
      setShowCourseForm(false);
      // إعادة جلب المقررات
      await dispatch(fetchCoursesByUniversity(selectedUniForCourses.id));
    } catch (error) {
      console.error("فشل في حفظ المقرر:", error);
      alert("فشل في حفظ المقرر: " + (error.message || JSON.stringify(error)));
    }
  };

  const handleCourseDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المقرر؟")) {
      try {
        await dispatch(deleteCourseAsync(id)).unwrap();
        await dispatch(fetchCoursesByUniversity(selectedUniForCourses.id));
      } catch (error) {
        console.error("فشل في حذف المقرر:", error);
      }
    }
  };

  // التأكد من أن universities مصفوفة دائماً
  const safeUniversities = Array.isArray(universities) ? universities : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  // 🔹 دالة مساعدة لتنسيق التاريخ الميلادي
  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  if (!mounted)
    return <div className="min-h-screen bg-[#ecf4ff]"></div>;

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <PageHeader
        title="إدارة الجامعات"
        description="قم بإدارة الجامعات، تعديل بياناتها، وإضافة المقررات عبر لوحة واحدة منظمة."
        actions={
          <Button
            type="button"
            variant="primary"
            icon={PlusCircle}
            disabled={loading}
            onClick={() => {
              setShowForm(true);
              setEditUni(null);
            }}
          >
            إضافة جامعة
          </Button>
        }
      />

      {/* 🔹 رسالة الخطأ */}
      {error && (
        <Card tone="outline" padding="p-4">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <p className="font-semibold">❌ خطأ:</p>
            <p>{typeof error === "string" ? error : JSON.stringify(error)}</p>
          </div>
        </Card>
      )}

      <Card title="قائمة الجامعات" icon={University}>
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">اسم الجامعة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">العنوان</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden lg:table-cell">البريد الإلكتروني</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">الهاتف</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الدولة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden 2xl:table-cell">تاريخ الإنشاء</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden 2xl:table-cell">تاريخ التحديث</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {safeUniversities.length ? (
                  safeUniversities.map((uni, idx) => (
                    <tr key={uni.id || `uni-${idx}`} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">
                        {uni.name}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden xl:table-cell">{uni.address || "—"}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden lg:table-cell">{uni.email || "—"}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden xl:table-cell">{uni.phone || "—"}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f]">{uni.country || "—"}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        {uni.is_active ? (
                          <span className="inline-flex items-center justify-center gap-1 text-green-600">
                            <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                            <span className="hidden sm:inline">نشط</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1 text-red-600">
                            <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                            <span className="hidden sm:inline">غير نشط</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-xs text-[#6b7a94] whitespace-nowrap hidden 2xl:table-cell">
                        {formatDate(uni.created_at)}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-xs text-[#6b7a94] whitespace-nowrap hidden 2xl:table-cell">
                        {formatDate(uni.updated_at)}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleShowCourses(uni)}
                            className="text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">عرض المقررات</span>
                            <span className="sm:hidden">المقررات</span>
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setEditUni(uni);
                              setFormData({
                                name: uni.name || "",
                                description: uni.description || "",
                                address: uni.address || "",
                                city: uni.city || "",
                                country: uni.country || "",
                                website: uni.website || "",
                                email: uni.email || "",
                                phone: uni.phone || "",
                                is_active: uni.is_active !== undefined ? uni.is_active : true,
                              });
                              setShowForm(true);
                            }}
                          >
                            تعديل
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(uni.id)}
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <University className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد جامعات حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94] max-w-md">
                          ابدأ بإضافة جامعة جديدة أو قم بتحديث البيانات لجلب أحدث السجلات.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* بطاقات للشاشات الصغيرة والمتوسطة */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safeUniversities.length ? (
            safeUniversities.map((uni, idx) => (
              <div key={uni.id || `uni-card-${idx}`} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base text-[#0f1f3f] flex-1">{uni.name}</h3>
                    {uni.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle2 size={14} /> نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs">
                        <XCircle size={14} /> غير نشط
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 text-sm text-[#3f4a5f]">
                    {uni.email && <p className="truncate">📧 {uni.email}</p>}
                    {uni.phone && <p>📞 {uni.phone}</p>}
                    {uni.address && <p className="line-clamp-2">📍 {uni.address}</p>}
                    {uni.country && <p>🌍 {uni.country}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleShowCourses(uni)}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      المقررات
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditUni(uni);
                        setFormData({
                          name: uni.name || "",
                          description: uni.description || "",
                          address: uni.address || "",
                          city: uni.city || "",
                          country: uni.country || "",
                          website: uni.website || "",
                          email: uni.email || "",
                          phone: uni.phone || "",
                          is_active: uni.is_active !== undefined ? uni.is_active : true,
                        });
                        setShowForm(true);
                      }}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(uni.id)}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full px-4 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <University className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد جامعات حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإضافة جامعة جديدة</p>
              </div>
            </div>
          )}
        </div>
      </Card>


      {/* 🔹 النموذج المنبثق (Modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-5 bg-gradient-to-r from-[#4d9dff]/18 via-[#d7e8ff]/35 to-white border-b border-[#d6e4ff]/50">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0f1f3f]">
                {editUni ? "✏️ تعديل جامعة" : "➕ إضافة جامعة جديدة"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-full hover:bg-[#ecf4ff] transition-colors"
                aria-label="إغلاق"
              >
                <X size={20} className="text-[#3f4a5f]" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="p-4 sm:p-6 overflow-y-auto flex-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="اسم الجامعة"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="text"
                  placeholder="العنوان"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <textarea
                  placeholder="الوصف"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5 min-h-[100px] resize-y col-span-1 sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="المدينة"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="text"
                  placeholder="الدولة"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="url"
                  placeholder="الموقع الإلكتروني"
                  value={formData.website || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <div className="flex items-center gap-2 p-3 border border-[#d6e4ff] rounded-xl bg-[#ecf4ff]/60 col-span-1 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active || false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-[#8aa7d6] text-[#2f87f5] focus:ring-2 focus:ring-[#2f87f5]"
                  />
                  <label className="text-xs sm:text-sm font-medium text-[#0f1f3f] cursor-pointer">حالة نشطة</label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-[#d6e4ff]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="flex-1 sm:flex-none"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  icon={Save}
                  className="flex-1 sm:flex-none"
                >
                  {loading ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Modal عرض المقررات */}
      {showCourses && selectedUniForCourses && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-5 bg-gradient-to-r from-[#4d9dff]/18 via-[#d7e8ff]/35 to-white border-b border-[#d6e4ff]/50">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0f1f3f] truncate">
                📚 مقررات {selectedUniForCourses.name}
              </h2>
              <button
                onClick={handleCloseCourses}
                className="p-1.5 rounded-full hover:bg-[#ecf4ff] transition-colors shrink-0"
                aria-label="إغلاق"
              >
                <X size={20} className="text-[#3f4a5f]" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {/* زر إضافة مقرر */}
              <div className="mb-4">
                <Button
                  type="button"
                  variant="primary"
                  icon={PlusCircle}
                  onClick={() => {
                    setEditCourse(null);
                    setCourseFormData({
                      name: "",
                      code: "",
                      level: "",
                      duration_years: "",
                      is_active: true,
                    });
                    setShowCourseForm(true);
                  }}
                >
                  إضافة مقرر
                </Button>
              </div>

              {/* جدول المقررات */}
              <div className="rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">اسم المقرر</th>
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden sm:table-cell">رمز المقرر</th>
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden md:table-cell">المستوى</th>
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden lg:table-cell">مدة الدراسة (سنوات)</th>
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                        <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeCourses.length > 0 ? (
                        safeCourses.map((course, idx) => (
                          <tr key={`${course.id || 'course'}-${idx}`} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{idx + 1}</td>
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">{course.name}</td>
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden sm:table-cell">{course.code || "—"}</td>
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden md:table-cell">{course.level || "—"}</td>
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden lg:table-cell">{course.duration_years || "—"}</td>
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                              {course.is_active ? (
                                <CheckCircle2 className="text-green-600 mx-auto" size={18} />
                              ) : (
                                <XCircle className="text-red-600 mx-auto" size={18} />
                              )}
                            </td>
                            <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  icon={Pencil}
                                  onClick={() => {
                                    setEditCourse(course);
                                    setCourseFormData({
                                      name: course.name || "",
                                      code: course.code || "",
                                      level: course.level || "",
                                      duration_years: course.duration_years ? String(course.duration_years) : "",
                                      is_active: course.is_active !== undefined ? course.is_active : true,
                                    });
                                    setShowCourseForm(true);
                                  }}
                                  className="text-xs"
                                >
                                  تعديل
                                </Button>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  icon={Trash2}
                                  onClick={() => handleCourseDelete(course.id)}
                                  className="text-xs"
                                >
                                  حذف
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 py-12 sm:py-16 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                              <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد مقررات حالياً</p>
                              <p className="text-sm text-[#6b7a94]">ابدأ بإضافة مقرر جديد</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal نموذج المقرر */}
      {showCourseForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-5 bg-gradient-to-r from-[#4d9dff]/18 via-[#d7e8ff]/35 to-white border-b border-[#d6e4ff]/50">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0f1f3f]">
                {editCourse ? "✏️ تعديل مقرر" : "➕ إضافة مقرر جديد"}
              </h2>
              <button
                onClick={() => setShowCourseForm(false)}
                className="p-1.5 rounded-full hover:bg-[#ecf4ff] transition-colors"
                aria-label="إغلاق"
              >
                <X size={20} className="text-[#3f4a5f]" />
              </button>
            </div>

            <form
              onSubmit={handleCourseSave}
              className="p-4 sm:p-6 overflow-y-auto flex-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="اسم المقرر *"
                  value={courseFormData.name || ""}
                  onChange={(e) =>
                    setCourseFormData({ ...courseFormData, name: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="text"
                  placeholder="رمز المقرر *"
                  value={courseFormData.code || ""}
                  onChange={(e) =>
                    setCourseFormData({ ...courseFormData, code: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="text"
                  placeholder="المستوى"
                  value={courseFormData.level || ""}
                  onChange={(e) =>
                    setCourseFormData({ ...courseFormData, level: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <input
                  type="number"
                  placeholder="مدة الدراسة (سنوات)"
                  value={courseFormData.duration_years || ""}
                  onChange={(e) =>
                    setCourseFormData({ ...courseFormData, duration_years: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5"
                />
                <div className="flex items-center gap-2 p-3 border border-[#d6e4ff] rounded-xl bg-[#ecf4ff]/60 col-span-1 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={courseFormData.is_active || false}
                    onChange={(e) =>
                      setCourseFormData({ ...courseFormData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-[#8aa7d6] text-[#2f87f5] focus:ring-2 focus:ring-[#2f87f5]"
                  />
                  <label className="text-xs sm:text-sm font-medium text-[#0f1f3f] cursor-pointer">حالة نشطة</label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-[#d6e4ff]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCourseForm(false)}
                  className="flex-1 sm:flex-none"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={coursesLoading}
                  icon={Save}
                  className="flex-1 sm:flex-none"
                >
                  {coursesLoading ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const [showForm, setShowForm] = useState(false);
  const [editUni, setEditUni] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    website: "",
    email: "",
    phone: "",
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
      // 🔹 طباعة البيانات المرسلة للتحقق
      console.log("📤 البيانات المرسلة إلى API:", JSON.stringify(formData, null, 2));
      
      let universityId;
      if (editUni) {
        // تحديث جامعة موجودة
        const result = await dispatch(
          updateUniversityAsync({ id: editUni.id, data: formData })
        ).unwrap();
        console.log("📥 استجابة API بعد التحديث:", JSON.stringify(result, null, 2));
        universityId = editUni.id;
        alert("✅ تم تحديث الجامعة بنجاح");
      } else {
        // إنشاء جامعة جديدة
        const result = await dispatch(createUniversity(formData)).unwrap();
        console.log("📥 استجابة API بعد الإنشاء:", JSON.stringify(result, null, 2));
        // 🔹 الحصول على ID الجامعة الجديدة
        universityId = result?.data?.id || result?.id;
        alert("✅ تم إضافة الجامعة بنجاح");
      }
      
      // 🔹 إعادة جلب جميع البيانات من API لضمان الحصول على جميع الحقول
      // 💡 الأهم: يجب انتظار اكتمال هذا الإجراء قبل مسح النموذج!
      await dispatch(fetchUniversities());
      
      // ⬅️ تم نقل هذا الكود إلى هنا **بعد** await dispatch(fetchUniversities())
      setFormData({
        name: "",
        short_name: "",
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
      const errorMessage = error?.message || error?.toString() || "حدث خطأ غير متوقع";
      alert(`❌ فشل في حفظ الجامعة: ${errorMessage}`);
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

  // التأكد من أن universities مصفوفة دائماً
  const safeUniversities = Array.isArray(universities) ? universities : [];

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
        description="قم بإدارة الجامعات وتعديل بياناتها عبر لوحة واحدة منظمة."
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
        {/* بطاقات لجميع الشاشات */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {safeUniversities.length ? (
            safeUniversities.map((uni, idx) => (
              <div key={uni.id || `uni-card-${idx}`} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4d9dff] to-[#155fba] flex items-center justify-center flex-shrink-0">
                        <University className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-[#0f1f3f] truncate">{uni.name || "—"}</h3>
                        {uni.short_name && (
                          <p className="text-xs text-[#6b7a94] mt-0.5">({uni.short_name})</p>
                        )}
                      </div>
                    </div>
                    {uni.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                        <CheckCircle2 size={14} /> نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
                        <XCircle size={14} /> غير نشط
                      </span>
                    )}
                  </div>
                  {uni.description && (
                    <p className="text-sm text-[#3f4a5f] line-clamp-2 bg-[#ecf4ff]/40 px-2 py-1.5 rounded">📝 {uni.description}</p>
                  )}
                  <div className="pt-2 border-t border-[#d6e4ff]/50 space-y-1.5 text-sm text-[#3f4a5f]">
                    {uni.email && (
                      <p className="flex items-center gap-1.5 truncate">
                        <span>📧</span>
                        <a href={`mailto:${uni.email}`} className="text-[#2f87f5] hover:underline truncate">
                          {uni.email}
                        </a>
                      </p>
                    )}
                    {uni.phone && (
                      <p className="flex items-center gap-1.5">
                        <span>📞</span>
                        <span>{uni.phone}</span>
                      </p>
                    )}
                    {uni.address && (
                      <p className="flex items-start gap-1.5 line-clamp-2">
                        <span>📍</span>
                        <span>{uni.address}</span>
                      </p>
                    )}
                    {(uni.city || uni.country) && (
                      <p className="flex items-center gap-1.5">
                        <span>🌍</span>
                        <span>{[uni.city, uni.country].filter(Boolean).join(", ")}</span>
                      </p>
                    )}
                    {uni.website && (
                      <p className="flex items-center gap-1.5 truncate">
                        <span>🌐</span>
                        <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-[#2f87f5] hover:underline truncate">
                          {uni.website.length > 35 ? `${uni.website.substring(0, 35)}...` : uni.website}
                        </a>
                      </p>
                    )}
                  </div>
                  {(uni.created_at || uni.updated_at) && (
                    <div className="text-xs text-[#6b7a94] bg-[#ecf4ff]/40 px-2 py-1 rounded">
                      {uni.created_at && <p>تاريخ الإنشاء: {formatDate(uni.created_at)}</p>}
                      {uni.updated_at && <p>آخر تحديث: {formatDate(uni.updated_at)}</p>}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditUni(uni);
                        setFormData({
                          name: uni.name || "",
                          short_name: uni.short_name || "",
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
                      className="flex-1"
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(uni.id)}
                      className="flex-1"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
              <div className="space-y-4">
                {/* معلومات أساسية */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#0f1f3f] border-b border-[#d6e4ff] pb-2">المعلومات الأساسية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">
                        اسم الجامعة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="أدخل اسم الجامعة"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">
                        الاسم المختصر <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="أدخل الاسم المختصر"
                        value={formData.short_name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, short_name: e.target.value })
                        }
                        required
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">الوصف</label>
                      <textarea
                        placeholder="أدخل وصف الجامعة"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] resize-y"
                      />
                    </div>
                  </div>
                </div>

                {/* معلومات الاتصال */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#0f1f3f] border-b border-[#d6e4ff] pb-2">معلومات الاتصال</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        placeholder="example@university.edu"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">رقم الهاتف</label>
                      <input
                        type="tel"
                        placeholder="+963 11 1234567"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">الموقع الإلكتروني</label>
                      <input
                        type="url"
                        placeholder="https://www.university.edu"
                        value={formData.website || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                  </div>
                </div>

                {/* العنوان */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#0f1f3f] border-b border-[#d6e4ff] pb-2">العنوان</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">العنوان الكامل</label>
                      <input
                        type="text"
                        placeholder="أدخل العنوان الكامل للجامعة"
                        value={formData.address || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">المدينة</label>
                      <input
                        type="text"
                        placeholder="أدخل المدينة"
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#3f4a5f] mb-1.5">
                        الدولة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="أدخل الدولة"
                        value={formData.country || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                        className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)]"
                      />
                    </div>
                  </div>
                </div>

                {/* الحالة */}
                <div className="flex items-center gap-3 p-4 border border-[#d6e4ff] rounded-xl bg-[#ecf4ff]/60">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active || false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-[#8aa7d6] text-[#2f87f5] focus:ring-2 focus:ring-[#2f87f5] cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-[#0f1f3f] cursor-pointer">
                    الجامعة نشطة
                  </label>
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

    </div>
  );
}

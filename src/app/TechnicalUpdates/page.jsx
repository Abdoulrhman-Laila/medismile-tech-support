"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUpdate,
  updateUpdate,
  deleteUpdate,
} from "@/redux/slices/techUpdatesSlice";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle2,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";

export default function TechUpdatesPage() {
  const dispatch = useDispatch();
  const { techUpdates } = useSelector((state) => state.techUpdates);

  const [showForm, setShowForm] = useState(false);
  const [editUpdate, setEditUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "قيد التنفيذ",
    date: "",
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSave = () => {
    if (editUpdate) {
      dispatch(updateUpdate({ ...formData, id: editUpdate.id }));
    } else {
      dispatch(addUpdate({ ...formData, id: Date.now() }));
    }
    setFormData({ title: "", type: "", status: "قيد التنفيذ", date: "" });
    setEditUpdate(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من حذف هذا التحديث؟")) {
      dispatch(deleteUpdate(id));
    }
  };

  const completedUpdates = techUpdates.filter((item) => item.status === "مكتمل").length;
  const inProgressUpdates = techUpdates.length - completedUpdates;

  const headerMeta = [
    { label: "إجمالي التحديثات", value: techUpdates.length },
    { label: "قيد التنفيذ", value: inProgressUpdates },
    { label: "مكتملة", value: completedUpdates },
  ];

  const inputBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";
  const selectBaseClass = inputBaseClass;
  const formGridClass = "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4";

  const statusTone = (status) =>
    status === "مكتمل"
      ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(48,185,128,0.12)] text-[#1f8d62]"
      : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(43,164,240,0.16)] text-[#1c7db5]";

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="إدارة التحديثات التقنية"
        description="تنظيم نشر التحديثات التقنية وتوثيق حالتها.
        "
        meta={headerMeta}
        actions={
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => {
              setShowForm(true);
              setEditUpdate(null);
              setFormData({ title: "", type: "", status: "قيد التنفيذ", date: "" });
            }}
          >
            إضافة تحديث
          </Button>
        }
      />

      <Card title="قائمة التحديثات" icon={RefreshCcw}>
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">عنوان التحديث</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">نوع التحديث</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden 2xl:table-cell">التاريخ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {techUpdates.length ? (
                  techUpdates.map((item, idx) => (
                    <tr key={item.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{idx + 1}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">{item.title}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden xl:table-cell">{item.type}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        <span className={statusTone(item.status)}>{item.status}</span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-xs text-[#6b7a94] whitespace-nowrap hidden 2xl:table-cell">{item.date}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Pencil}
                            onClick={() => {
                              setEditUpdate(item);
                              setFormData(item);
                              setShowForm(true);
                            }}
                            className="text-xs sm:text-sm"
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(item.id)}
                            className="text-xs sm:text-sm"
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <RefreshCcw className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد تحديثات حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94]">ابدأ بإضافة تحديث جديد</p>
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
          {techUpdates.length ? (
            techUpdates.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0f1f3f] mb-2">{item.title}</h3>
                    <div className="space-y-1.5 text-sm text-[#3f4a5f]">
                      <p>🛠️ النوع: {item.type}</p>
                      <p>📅 {item.date}</p>
                      <div className="pt-1">
                        <span className={statusTone(item.status)}>الحالة: {item.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Pencil}
                      onClick={() => {
                        setEditUpdate(item);
                        setFormData(item);
                        setShowForm(true);
                      }}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(item.id)}
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
                <RefreshCcw className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد تحديثات حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإضافة تحديث جديد</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-5 bg-gradient-to-r from-[#4d9dff]/18 via-[#d7e8ff]/35 to-white border-b border-[#d6e4ff]/50">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0f1f3f]">
                  {editUpdate ? "تعديل تحديث" : "إضافة تحديث جديد"}
                </h2>
                <p className="text-xs sm:text-sm text-[#6b7a94] mt-1">أدخل معلومات التحديث لضمان إبلاغ الفريق بما هو جديد.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-full hover:bg-[#ecf4ff] transition-colors shrink-0"
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
              <div className={formGridClass}>
                <input
                  type="text"
                  placeholder="عنوان التحديث"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputBaseClass}
                  required
                />
                <input
                  type="text"
                  placeholder="نوع التحديث"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={inputBaseClass}
                  required
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={selectBaseClass}
                >
                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                  <option value="مكتمل">مكتمل</option>
                </select>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputBaseClass}
                  required
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-[#d6e4ff]">
                <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1 sm:flex-none">
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" icon={Save} className="flex-1 sm:flex-none">
                  حفظ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

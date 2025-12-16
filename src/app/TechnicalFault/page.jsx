"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addFault,
  updateStatus,
  deleteFault,
} from "@/redux/slices/technicalFaultsSlice";
import {
  AlertTriangle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";

export default function TechnicalFaultPage() {
  const dispatch = useDispatch();
  const { faults } = useSelector((state) => state.technicalFaults);

  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("منخفضة");
  const [assignedTo, setAssignedTo] = useState("");

  const handleAddFault = () => {
    if (!description || !assignedTo) return alert("الرجاء إدخال جميع البيانات");

    const newFault = {
      id: Date.now(),
      description,
      date: new Date().toISOString().split("T")[0],
      priority,
      status: "قيد المعالجة",
      assignedTo,
    };

    dispatch(addFault(newFault));
    setDescription("");
    setAssignedTo("");
    setPriority("منخفضة");
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateStatus({ id, newStatus }));
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من حذف هذا العطل؟")) dispatch(deleteFault(id));
  };

  // ✅ تأكيد تحميل البيانات بعد Hydration
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const openFaults = faults.filter((fault) => fault.status !== "منجز").length;
  const completedFaults = faults.filter((fault) => fault.status === "منجز").length;

  const headerMeta = [
    { label: "إجمالي الأعطال", value: faults.length },
    { label: "قيد المعالجة", value: openFaults },
    { label: "مكتملة", value: completedFaults },
  ];

  const inputBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";
  const selectBaseClass = inputBaseClass;
  const formGridClass = "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4";

  if (!isMounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الأعطال التقنية"
        description="سجل وتتبع الأعطال التقنية وتابع تقدم حلها بشكل منظم."
        meta={headerMeta}
        actions={
          <Button variant="primary" icon={PlusCircle} onClick={handleAddFault}>
            إضافة عطل جديد
          </Button>
        }
      />

      <Card title="قائمة الأعطال" icon={AlertTriangle}>
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الوصف</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">التاريخ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الأولوية</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden 2xl:table-cell">المسؤول</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {faults.length ? (
                  faults.map((fault, index) => (
                    <tr key={fault.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{index + 1}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">{fault.description}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden xl:table-cell">{fault.date}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f]">{fault.priority}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <select
                          value={fault.status}
                          onChange={(e) => handleStatusChange(fault.id, e.target.value)}
                          className={`${selectBaseClass} text-xs sm:text-sm`}
                        >
                          <option value="قيد المعالجة">قيد المعالجة</option>
                          <option value="منجز">منجز</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden 2xl:table-cell">{fault.assignedTo}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(fault.id)} className="text-xs sm:text-sm">
                          حذف
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد أعطال مسجلة حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94]">ابدأ بإضافة عطل جديد</p>
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
          {faults.length ? (
            faults.map((fault) => (
              <div key={fault.id} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0f1f3f] mb-2">{fault.description}</h3>
                    <div className="space-y-1.5 text-sm text-[#3f4a5f]">
                      <p>📅 {fault.date}</p>
                      <p>⚙️ الأولوية: {fault.priority}</p>
                      <p>👨‍🔧 المسؤول: {fault.assignedTo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <select
                      value={fault.status}
                      onChange={(e) => handleStatusChange(fault.id, e.target.value)}
                      className={`${selectBaseClass} flex-1 text-xs`}
                    >
                      <option value="قيد المعالجة">قيد المعالجة</option>
                      <option value="منجز">منجز</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(fault.id)} className="text-xs shrink-0">
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full px-4 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <AlertTriangle className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد أعطال مسجلة حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإضافة عطل جديد</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="إضافة عطل جديد"
        description="أدخل تفاصيل العطل وحدد المسؤول لمعالجة المشكلة."
        icon={AlertTriangle}
      >
        <form className={formGridClass} onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="وصف العطل"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputBaseClass}
            required
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={selectBaseClass}
          >
            <option value="منخفضة">منخفضة</option>
            <option value="متوسطة">متوسطة</option>
            <option value="عالية">عالية</option>
          </select>
          <input
            type="text"
            placeholder="اسم المسؤول"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className={inputBaseClass}
            required
          />
          <div className="col-span-2 flex justify-end">
            <Button variant="primary" icon={CheckCircle2} onClick={handleAddFault}>
              حفظ العطل
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

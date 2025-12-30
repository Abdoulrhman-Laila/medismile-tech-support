"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchAppointments,
  getAppointmentDetails,
  setAppointmentsFilters,
  clearAppointmentsError,
} from "@/redux/slices/appointmentsSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const { appointments, currentAppointment, loading, error, filters } = useSelector(
    (state) => state.appointments
  );
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointments(filters));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAppointments(filters));
  };

  const handleFilterChange = (key, value) => {
    const normalized = value || null;
    const next = { ...filters, [key]: normalized };
    dispatch(setAppointmentsFilters({ [key]: normalized }));
    dispatch(fetchAppointments(next));
  };

  const handleSelectAppointment = async (a) => {
    if (!a?.id) return;
    setSelectedId(a.id);
    try {
      await dispatch(getAppointmentDetails(a.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل الموعد:", err);
    }
  };

  const filteredAppointments = useMemo(() => {
    return (appointments || []).filter((a) => {
      if (filters.status && a.status !== filters.status) return false;
      if (filters.case_id && a.case?.id !== filters.case_id) return false;
      return true;
    });
  }, [appointments, filters]);

  const headerMeta = [
    { label: "إجمالي المواعيد", value: appointments?.length ?? 0 },
    {
      label: "مجدولة/مؤكدة",
      value: (appointments || []).filter((a) =>
        ["scheduled", "confirmed"].includes(a.status)
      ).length,
    },
  ];

  const inputBaseClass =
    "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="المواعيد"
          description="مراقبة جميع المواعيد المرتبطة بالحالات السريرية (قراءة فقط)."
          icon={FileText}
          meta={headerMeta}
          actions={
            <Button variant="outline" size="sm" icon={RefreshCcw} onClick={handleRefresh}>
              تحديث
            </Button>
          }
        />

        {error && (
          <Card tone="danger">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-red-700">{error}</p>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => dispatch(clearAppointmentsError())}
              >
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* قائمة المواعيد + فلاتر */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <select
                  className={inputBaseClass}
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">كل الحالات</option>
                  <option value="scheduled">مجدول</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                  <option value="no_show">عدم حضور</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة المواعيد"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل المواعيد...</p>
              )}
              {!loading && filteredAppointments.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد مواعيد مطابقة للفلتر الحالي.
                </p>
              )}
              <ul className="space-y-2">
                {filteredAppointments.map((a) => {
                  const isActiveRow = selectedId === a.id;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectAppointment(a)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {a.case?.title || "موعد بدون عنوان حالة"}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {a.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>
                            {a.appointment_date
                              ? new Date(a.appointment_date).toLocaleString()
                              : ""}
                          </span>
                          <span>{a.patient?.email || "مريض غير محدد"}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل الموعد */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentAppointment ? "تفاصيل الموعد" : "لا يوجد موعد محدد"}
              tone="outline"
              icon={FileText}
            >
              {currentAppointment ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {currentAppointment.status}
                    </span>
                    {currentAppointment.is_follow_up && (
                      <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                        متابعة
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#3f4a5f]">
                    <span className="font-semibold">التاريخ والوقت: </span>
                    {currentAppointment.appointment_date
                      ? new Date(currentAppointment.appointment_date).toLocaleString()
                      : "غير محدد"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4b5563] mt-2">
                    <div>
                      <span className="font-semibold">المريض:</span>{" "}
                      <span>{currentAppointment.patient?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">الطالب:</span>{" "}
                      <span>{currentAppointment.student?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">المشرف:</span>{" "}
                      <span>{currentAppointment.supervisor?.email || "—"}</span>
                    </div>
                  </div>
                  {currentAppointment.notes && (
                    <p className="mt-2 whitespace-pre-line text-sm text-[#3f4a5f]">
                      {currentAppointment.notes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر موعداً من القائمة اليمنى لعرض تفاصيله.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




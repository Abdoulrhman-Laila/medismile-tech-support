"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchReports,
  getReportDetails,
  updateReportStatus,
  setReportsFilters,
  clearReportsError,
} from "@/redux/slices/reportsSlice";
import { FileText, Eye, RefreshCcw } from "lucide-react";

export default function ReportsPage() {
  const dispatch = useDispatch();
  const {
    reports,
    currentReport,
    loading,
    error,
    operationLoading,
    operationError,
    filters,
  } = useSelector((state) => state.reports);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchReports({ is_active: filters.is_active }));
  }, [dispatch, filters.is_active]);

  const handleSelectReport = async (report) => {
    if (!report?.id) return;
    setSelectedId(report.id);
    try {
      await dispatch(getReportDetails(report.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل التقرير:", err);
    }
  };

  const handleToggleActive = async () => {
    if (!currentReport?.id) return;
    const newValue = !currentReport.is_active;
    try {
      await dispatch(
        updateReportStatus({ reportId: currentReport.id, isActive: newValue })
      ).unwrap();
    } catch (err) {
      console.error("❌ فشل تحديث حالة التقرير:", err);
    }
  };

  const filteredReports = useMemo(() => {
    return (reports || []).filter((r) => {
      if (filters.report_type && r.report_type !== filters.report_type) return false;
      if (filters.student_id && r.student?.id !== filters.student_id) return false;
      if (filters.university_id && r.university?.id !== filters.university_id) return false;
      if (typeof filters.is_active === "boolean" && r.is_active !== filters.is_active) {
        return false;
      }
      return true;
    });
  }, [reports, filters]);

  const handleFilterChange = (key, value) => {
    dispatch(
      setReportsFilters({
        [key]:
          key === "is_active"
            ? value === ""
              ? null
              : value === "true"
            : value || null,
      })
    );
  };

  const headerMeta = [
    { label: "إجمالي التقارير", value: reports?.length ?? 0 },
    {
      label: "مفعّلة",
      value: (reports || []).filter((r) => r.is_active).length,
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
          title="إدارة التقارير"
          description="عرض تقارير الطلاب والجامعات والتحكم في تفعيلها."
          icon={FileText}
          meta={headerMeta}
          actions={
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCcw}
              onClick={() => dispatch(fetchReports({ is_active: filters.is_active }))}
            >
              تحديث
            </Button>
          }
        />

        {(error || operationError) && (
          <Card tone="danger">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-red-700">{error || operationError}</p>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => dispatch(clearReportsError())}
              >
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* الفلاتر وقائمة التقارير */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="تصفية التقارير" tone="outline">
              <div className="grid grid-cols-1 gap-3">
                <select
                  className={inputBaseClass}
                  value={filters.report_type || ""}
                  onChange={(e) => handleFilterChange("report_type", e.target.value)}
                >
                  <option value="">كل الأنواع</option>
                  <option value="academic">أداء أكاديمي</option>
                  <option value="clinical">أداء سريري</option>
                  <option value="attendance">الحضور</option>
                  <option value="evaluation">ملخص التقييمات</option>
                  <option value="progress">تقرير التقدم</option>
                  <option value="statistical">تحليل إحصائي</option>
                  <option value="other">أخرى</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={
                    typeof filters.is_active === "boolean" ? String(filters.is_active) : ""
                  }
                  onChange={(e) => handleFilterChange("is_active", e.target.value)}
                >
                  <option value="">الكل (مفعّلة / مخفية)</option>
                  <option value="true">مفعّلة فقط</option>
                  <option value="false">مخفية فقط</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة التقارير"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل التقارير...</p>
              )}
              {!loading && filteredReports.length === 0 && (
                <p className="text-sm text-[#6b7a94]">لا توجد تقارير مطابقة للفلتر.</p>
              )}
              <ul className="space-y-2">
                {filteredReports.map((report) => {
                  const isActiveRow = selectedId === report.id;
                  return (
                    <li key={report.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectReport(report)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {report.title || "تقرير بدون عنوان"}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {report.report_type || "غير محدد"}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>{report.student?.email || "طالب غير محدد"}</span>
                          <span>{report.university?.name || "جامعة غير محددة"}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل التقرير */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentReport ? "تفاصيل التقرير" : "لا يوجد تقرير محدد"}
              tone="outline"
              icon={Eye}
            >
              {currentReport ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {currentReport.report_type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                      {currentReport.is_active ? "مفعّل" : "مخفي"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3f]">
                    {currentReport.title || "تقرير بدون عنوان"}
                  </h3>
                  {currentReport.description && (
                    <p className="whitespace-pre-line text-sm text-[#3f4a5f]">
                      {currentReport.description}
                    </p>
                  )}
                  {currentReport.snapshot_data && (
                    <Card tone="muted" className="mt-2">
                      <p className="text-xs font-semibold text-[#3f4a5f] mb-1">
                        بيانات ملخصة (Snapshot)
                      </p>
                      <pre className="text-[11px] text-[#111827] whitespace-pre-wrap break-all">
                        {JSON.stringify(currentReport.snapshot_data, null, 2)}
                      </pre>
                    </Card>
                  )}
                  {currentReport.file_url && (
                    <a
                      href={currentReport.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#1d72dd] hover:underline"
                    >
                      فتح ملف التقرير
                    </a>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant={currentReport.is_active ? "outline" : "primary"}
                      size="sm"
                      disabled={operationLoading}
                      onClick={handleToggleActive}
                    >
                      {currentReport.is_active ? "إخفاء التقرير" : "إظهار التقرير"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر تقريراً من القائمة اليسرى لعرض تفاصيله وإدارته.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




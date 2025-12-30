"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchAIDiagnoses,
  getAIDiagnosisDetails,
  setAIFilters,
  clearAIError,
} from "@/redux/slices/aiSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function AIDiagnosesPage() {
  const dispatch = useDispatch();
  const { diagnoses, currentDiagnosis, loading, error, filters } = useSelector(
    (state) => state.ai
  );

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAIDiagnoses(filters));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAIDiagnoses(filters));
  };

  const handleFilterChange = (key, value) => {
    const normalized = value || null;
    const next = { ...filters, [key]: normalized };
    dispatch(setAIFilters({ [key]: normalized }));
    dispatch(fetchAIDiagnoses(next));
  };

  const handleSelectDiagnosis = async (diag) => {
    if (!diag?.id) return;
    setSelectedId(diag.id);
    try {
      await dispatch(getAIDiagnosisDetails(diag.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل تشخيص AI:", err);
    }
  };

  const filteredDiagnoses = useMemo(
    () =>
      (diagnoses || []).filter((d) => {
        if (filters.status && d.status !== filters.status) return false;
        if (filters.student_id && d.student?.id !== filters.student_id) return false;
        if (filters.case_id && d.case?.id !== filters.case_id) return false;
        return true;
      }),
    [diagnoses, filters]
  );

  const headerMeta = [
    { label: "إجمالي تشخيصات AI", value: diagnoses?.length ?? 0 },
  ];

  const inputBaseClass =
    "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none";

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="تشخيصات الذكاء الاصطناعي"
          description="مراقبة التشخيصات التي ينتجها نظام الذكاء الاصطناعي للحالات السريرية."
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
              <Button size="xs" variant="ghost" onClick={() => dispatch(clearAIError())}>
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* الفلاتر وقائمة التشخيصات */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <select
                  className={inputBaseClass}
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">كل الحالات</option>
                  <option value="pending_review">بانتظار المراجعة</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة التشخيصات"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل التشخيصات...</p>
              )}
              {!loading && filteredDiagnoses.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد تشخيصات مطابقة للفلتر الحالي.
                </p>
              )}
              <ul className="space-y-2">
                {filteredDiagnoses.map((d) => {
                  const isActiveRow = selectedId === d.id;
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectDiagnosis(d)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {d.case?.title || "حالة غير معروفة"}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {d.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>{d.student?.email || "طالب غير معروف"}</span>
                          <span>
                            {d.confidence_score != null
                              ? `${Math.round(d.confidence_score * 100)}%`
                              : "—"}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل التشخيص */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentDiagnosis ? "تفاصيل التشخيص" : "لا يوجد تشخيص محدد"}
              tone="outline"
              icon={FileText}
            >
              {currentDiagnosis ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {currentDiagnosis.status}
                    </span>
                    {currentDiagnosis.confidence_score != null && (
                      <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                        درجة الثقة:{" "}
                        {Math.round(currentDiagnosis.confidence_score * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4b5563] mt-2">
                    <div>
                      <span className="font-semibold">الطالب:</span>{" "}
                      <span>{currentDiagnosis.student?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">رقم الحالة:</span>{" "}
                      <span>{currentDiagnosis.case?.id || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">التاريخ:</span>{" "}
                      <span>
                        {currentDiagnosis.created_at
                          ? new Date(currentDiagnosis.created_at).toLocaleString()
                          : "غير معروف"}
                      </span>
                    </div>
                  </div>
                  {currentDiagnosis.ai_output && (
                    <Card tone="muted" className="mt-2">
                      <p className="text-xs font-semibold text-[#3f4a5f] mb-1">
                        مخرجات AI
                      </p>
                      <pre className="text-[11px] text-[#111827] whitespace-pre-wrap break-all">
                        {typeof currentDiagnosis.ai_output === "string"
                          ? currentDiagnosis.ai_output
                          : JSON.stringify(currentDiagnosis.ai_output, null, 2)}
                      </pre>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر تشخيصاً من القائمة اليمنى لعرض تفاصيله.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchEvaluations,
  getEvaluationDetails,
  getStudentStatisticsThunk,
  setEvaluationsFilters,
  clearEvaluationsError,
} from "@/redux/slices/evaluationsSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function EvaluationsPage() {
  const dispatch = useDispatch();
  const { evaluations, currentEvaluation, studentStatistics, loading, error, filters } =
    useSelector((state) => state.evaluations);

  const [selectedId, setSelectedId] = useState(null);
  const [studentIdForStats, setStudentIdForStats] = useState("");

  useEffect(() => {
    dispatch(fetchEvaluations(filters));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchEvaluations(filters));
    if (studentIdForStats) {
      dispatch(getStudentStatisticsThunk(studentIdForStats));
    }
  };

  const handleFilterChange = (key, value) => {
    const normalized = value || null;
    const next = { ...filters, [key]: normalized };
    dispatch(setEvaluationsFilters({ [key]: normalized }));
    dispatch(fetchEvaluations(next));
  };

  const handleSelectEvaluation = async (e) => {
    if (!e?.id) return;
    setSelectedId(e.id);
    try {
      await dispatch(getEvaluationDetails(e.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل التقييم:", err);
    }
  };

  const handleLoadStudentStats = async () => {
    if (!studentIdForStats.trim()) return;
    try {
      await dispatch(getStudentStatisticsThunk(studentIdForStats.trim())).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب إحصائيات الطالب:", err);
    }
  };

  const filteredEvaluations = useMemo(() => {
    return (evaluations || []).filter((ev) => {
      if (filters.status && ev.status !== filters.status) return false;
      if (filters.target_type && ev.target_type !== filters.target_type) return false;
      if (filters.student_id && ev.student?.id !== filters.student_id) return false;
      return true;
    });
  }, [evaluations, filters]);

  const headerMeta = [
    { label: "إجمالي التقييمات", value: evaluations?.length ?? 0 },
    {
      label: "نهائية",
      value: (evaluations || []).filter((e) => e.status === "final").length,
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
          title="التقييمات"
          description="مراقبة التقييمات الأكاديمية والسريرية وإحصائيات أداء الطلاب."
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
                onClick={() => dispatch(clearEvaluationsError())}
              >
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* الفلاتر وقائمة التقييمات */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <select
                  className={inputBaseClass}
                  value={filters.target_type || ""}
                  onChange={(e) => handleFilterChange("target_type", e.target.value)}
                >
                  <option value="">كل الأهداف</option>
                  <option value="case">حالة</option>
                  <option value="session">جلسة</option>
                  <option value="appointment">موعد</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">كل الحالات</option>
                  <option value="draft">مسودة</option>
                  <option value="submitted">مقدم</option>
                  <option value="final">نهائي</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة التقييمات"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل التقييمات...</p>
              )}
              {!loading && filteredEvaluations.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد تقييمات مطابقة للفلتر الحالي.
                </p>
              )}
              <ul className="space-y-2">
                {filteredEvaluations.map((ev) => {
                  const isActiveRow = selectedId === ev.id;
                  return (
                    <li key={ev.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectEvaluation(ev)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {ev.student?.email || "طالب غير معروف"}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {ev.target_type}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>{ev.status}</span>
                          <span>{ev.score != null ? `${ev.score}` : "بدون درجة"}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل التقييم + إحصائيات الطالب */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentEvaluation ? "تفاصيل التقييم" : "لا يوجد تقييم محدد"}
              tone="outline"
              icon={FileText}
            >
              {currentEvaluation ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {currentEvaluation.target_type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                      {currentEvaluation.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4b5563] mt-2">
                    <div>
                      <span className="font-semibold">الطالب:</span>{" "}
                      <span>{currentEvaluation.student?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">المقيّم:</span>{" "}
                      <span>{currentEvaluation.evaluator?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">الدرجة:</span>{" "}
                      <span>{currentEvaluation.score != null ? currentEvaluation.score : "—"}</span>
                    </div>
                  </div>
                  {currentEvaluation.comment && (
                    <p className="mt-2 whitespace-pre-line text-sm text-[#3f4a5f]">
                      {currentEvaluation.comment}
                    </p>
                  )}
                  {currentEvaluation.rubric && (
                    <Card tone="muted" className="mt-2">
                      <p className="text-xs font-semibold text-[#3f4a5f] mb-1">
                        تفاصيل Rubric
                      </p>
                      <pre className="text-[11px] text-[#111827] whitespace-pre-wrap break-all">
                        {JSON.stringify(currentEvaluation.rubric, null, 2)}
                      </pre>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر تقييماً من القائمة اليمنى لعرض تفاصيله.
                </p>
              )}
            </Card>

            <Card title="إحصائيات طالب" tone="outline">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className={inputBaseClass}
                    placeholder="أدخل معرف الطالب (UUID)"
                    value={studentIdForStats}
                    onChange={(e) => setStudentIdForStats(e.target.value)}
                  />
                  <Button size="sm" onClick={handleLoadStudentStats}>
                    تحميل الإحصائيات
                  </Button>
                </div>
                {studentStatistics ? (
                  <div className="space-y-1 text-xs text-[#374151] mt-2">
                    <p>
                      <span className="font-semibold">الطالب:</span>{" "}
                      <span>{studentStatistics.student_name}</span>
                    </p>
                    <p>
                      <span className="font-semibold">المعدل:</span>{" "}
                      <span>{studentStatistics.average_score}</span>
                    </p>
                    <p>
                      <span className="font-semibold">إجمالي التقييمات:</span>{" "}
                      <span>{studentStatistics.total_evaluations}</span>
                    </p>
                    <div className="mt-1">
                      <p className="font-semibold">حسب الحالة:</p>
                      {Object.entries(studentStatistics.by_status || {}).map(
                        ([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span>{k}</span>
                            <span>{v}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#6b7a94]">
                    أدخل معرف طالب لتحميل إحصائياته.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




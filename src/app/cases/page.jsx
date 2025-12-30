"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchCases,
  getCaseDetails,
  setCasesFilters,
  clearCasesError,
} from "@/redux/slices/casesSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function CasesPage() {
  const dispatch = useDispatch();
  const { cases, currentCase, loading, error, filters } = useSelector(
    (state) => state.cases
  );
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchCases(filters));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCases(filters));
  };

  const handleFilterChange = (key, value) => {
    const normalized =
      key === "is_public"
        ? value === ""
          ? null
          : value === "true"
        : value || null;
    const next = { ...filters, [key]: normalized };
    dispatch(setCasesFilters({ [key]: normalized }));
    dispatch(fetchCases(next));
  };

  const handleSelectCase = async (c) => {
    if (!c?.id) return;
    setSelectedId(c.id);
    try {
      await dispatch(getCaseDetails(c.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل الحالة:", err);
    }
  };

  const filteredCases = useMemo(() => {
    return (cases || []).filter((c) => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.priority && c.priority !== filters.priority) return false;
      if (typeof filters.is_public === "boolean" && c.is_public !== filters.is_public)
        return false;
      return true;
    });
  }, [cases, filters]);

  const headerMeta = [
    { label: "إجمالي الحالات", value: cases?.length ?? 0 },
    {
      label: "نشطة",
      value: (cases || []).filter((c) => c.status !== "closed").length,
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
          title="الحالات السريرية"
          description="مراقبة جميع الحالات السريرية في النظام (قراءة فقط)."
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
              <Button size="xs" variant="ghost" onClick={() => dispatch(clearCasesError())}>
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* قائمة الحالات + فلاتر */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <select
                  className={inputBaseClass}
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">كل الحالات</option>
                  <option value="new">جديدة</option>
                  <option value="pending_assignment">في انتظار الإسناد</option>
                  <option value="assigned">مسندة</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتملة</option>
                  <option value="closed">مغلقة</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={filters.priority || ""}
                  onChange={(e) => handleFilterChange("priority", e.target.value)}
                >
                  <option value="">كل الأولويات</option>
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={
                    typeof filters.is_public === "boolean"
                      ? String(filters.is_public)
                      : ""
                  }
                  onChange={(e) => handleFilterChange("is_public", e.target.value)}
                >
                  <option value="">كل الحالات (عامة/خاصة)</option>
                  <option value="true">عامة (متاحة للإسناد)</option>
                  <option value="false">خاصة</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة الحالات"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل الحالات...</p>
              )}
              {!loading && filteredCases.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد حالات مطابقة للفلتر الحالي.
                </p>
              )}
              <ul className="space-y-2">
                {filteredCases.map((c) => {
                  const isActiveRow = selectedId === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectCase(c)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {c.title}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {c.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>{c.priority}</span>
                          <span>{c.is_public ? "عامة" : "خاصة"}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل الحالة */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentCase ? "تفاصيل الحالة" : "لا توجد حالة محددة"}
              tone="outline"
              icon={FileText}
            >
              {currentCase ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {currentCase.status}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5">
                      {currentCase.priority}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                      {currentCase.is_public ? "عامة" : "خاصة"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3f]">
                    {currentCase.title}
                  </h3>
                  <p className="whitespace-pre-line text-sm text-[#3f4a5f]">
                    {currentCase.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4b5563] mt-2">
                    <div>
                      <span className="font-semibold">المريض:</span>{" "}
                      <span>{currentCase.patient?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">الطالب:</span>{" "}
                      <span>{currentCase.student?.email || "—"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">المشرف:</span>{" "}
                      <span>{currentCase.supervisor?.email || "—"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر حالة من القائمة اليمنى لعرض تفاصيلها.
                </p>
              )}
            </Card>

            {currentCase && (
              <>
                <Card title="سجل الحالة (History)" tone="outline">
                  <div className="max-h-52 overflow-y-auto space-y-2 text-xs text-[#374151]">
                    {(currentCase.history || []).map((h) => (
                      <div
                        key={h.id}
                        className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold">{h.action}</span>
                          <span className="text-[10px] text-[#6b7280]">
                            {h.created_at
                              ? new Date(h.created_at).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="text-[11px] whitespace-pre-line">
                          {h.description}
                        </p>
                      </div>
                    ))}
                    {(!currentCase.history || currentCase.history.length === 0) && (
                      <p className="text-xs text-[#6b7a94]">لا يوجد سجل للحالة.</p>
                    )}
                  </div>
                </Card>

                <Card title="جلسات العلاج" tone="outline">
                  <div className="max-h-52 overflow-y-auto space-y-2 text-xs text-[#374151]">
                    {(currentCase.sessions || []).map((s) => (
                      <div
                        key={s.id}
                        className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold">{s.status}</span>
                          <span className="text-[10px] text-[#6b7280]">
                            {s.created_at
                              ? new Date(s.created_at).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="text-[11px] whitespace-pre-line">{s.notes}</p>
                      </div>
                    ))}
                    {(!currentCase.sessions || currentCase.sessions.length === 0) && (
                      <p className="text-xs text-[#6b7a94]">لا توجد جلسات لهذه الحالة.</p>
                    )}
                  </div>
                </Card>

                <Card title="طلبات الإسناد" tone="outline">
                  <div className="max-h-52 overflow-y-auto space-y-2 text-xs text-[#374151]">
                    {(currentCase.assignment_requests || []).map((r) => (
                      <div
                        key={r.id}
                        className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold">{r.status}</span>
                          <span className="text-[10px] text-[#6b7280]">
                            {r.created_at
                              ? new Date(r.created_at).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="text-[11px] whitespace-pre-line">
                          {r.message}
                        </p>
                      </div>
                    ))}
                    {(!currentCase.assignment_requests ||
                      currentCase.assignment_requests.length === 0) && (
                      <p className="text-xs text-[#6b7a94]">
                        لا توجد طلبات إسناد لهذه الحالة.
                      </p>
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




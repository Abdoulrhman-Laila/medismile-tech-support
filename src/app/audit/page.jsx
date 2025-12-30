"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchAuditLogs,
  getAuditStatisticsThunk,
  setAuditFilters,
  clearAuditError,
} from "@/redux/slices/auditSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function AuditPage() {
  const dispatch = useDispatch();
  const { logs, statistics, loading, error, filters } = useSelector(
    (state) => state.audit
  );

  useEffect(() => {
    dispatch(getAuditStatisticsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAuditLogs(filters));
  }, [filters, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAuditLogs(filters));
    dispatch(getAuditStatisticsThunk());
  };

  const handleFilterChange = (key, value) => {
    dispatch(setAuditFilters({ [key]: value || null }));
  };

  const headerMeta = [
    { label: "إجمالي السجلات", value: logs?.length ?? 0 },
    statistics?.action_counts && {
      label: "أكثر إجراء",
      value: statistics.action_counts[0]?.action ?? "—",
    },
  ].filter(Boolean);

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="سجلات التدقيق"
          description="متابعة كل الإجراءات المهمة في النظام لأغراض التدقيق والامتثال."
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
              <Button size="xs" variant="ghost" onClick={() => dispatch(clearAuditError())}>
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* فلاتر بسيطة */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b7a94]">
                    نوع الإجراء
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none"
                    value={filters.action || ""}
                    onChange={(e) => handleFilterChange("action", e.target.value)}
                  >
                    <option value="">الكل</option>
                    <option value="login">تسجيل الدخول</option>
                    <option value="logout">تسجيل الخروج</option>
                    <option value="create">إنشاء</option>
                    <option value="update">تحديث</option>
                    <option value="delete">حذف</option>
                    <option value="view">عرض</option>
                    <option value="download">تحميل</option>
                    <option value="upload">رفع</option>
                    <option value="approve">موافقة</option>
                    <option value="reject">رفض</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b7a94]">
                    معرف المستخدم
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none"
                    placeholder="UUID للمستخدم"
                    value={filters.user_id || ""}
                    onChange={(e) => handleFilterChange("user_id", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b7a94]">
                    نوع الكائن (Content Type)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none"
                    placeholder="مثال: case, appointment, report..."
                    value={filters.content_type || ""}
                    onChange={(e) => handleFilterChange("content_type", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b7a94]">
                    من تاريخ
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none"
                    value={filters.start_date || ""}
                    onChange={(e) => handleFilterChange("start_date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b7a94]">
                    إلى تاريخ
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none"
                    value={filters.end_date || ""}
                    onChange={(e) => handleFilterChange("end_date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b7a94]">
                    بحث نصي
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none"
                    placeholder="البحث في الوصف، metadata، email، username..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {statistics && (
              <Card title="ملخص الإحصائيات" tone="outline">
                <div className="space-y-4 text-xs text-[#3f4a5f]">
                  {statistics.action_counts && statistics.action_counts.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">توزيع الإجراءات:</p>
                      <div className="space-y-1">
                        {(statistics.action_counts || []).map((row) => (
                          <div key={row.action || row.name} className="flex justify-between">
                            <span>{row.action || row.name}</span>
                            <span className="font-semibold">{row.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {statistics.top_users && statistics.top_users.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">أعلى 10 مستخدمين:</p>
                      <div className="space-y-1">
                        {(statistics.top_users || []).map((user, idx) => (
                          <div key={user.id || idx} className="flex justify-between">
                            <span className="truncate">
                              {user.first_name} {user.last_name}
                            </span>
                            <span className="font-semibold">{user.count || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {statistics.daily_activity && statistics.daily_activity.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">النشاط اليومي (آخر 30 يوم):</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {(statistics.daily_activity || []).map((day, idx) => (
                          <div key={day.date || idx} className="flex justify-between">
                            <span>{day.date ? new Date(day.date).toLocaleDateString("ar-SA") : "—"}</span>
                            <span className="font-semibold">{day.count || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* جدول السجلات */}
          <div className="space-y-4 lg:col-span-2">
            <Card title="سجلات التدقيق" tone="outline">
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل سجلات التدقيق...</p>
              )}
              {!loading && logs.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد سجلات مطابقة للفلتر الحالي.
                </p>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full text-right text-xs text-[#0f1f3f]">
                  <thead>
                    <tr className="border-b border-[#d6e4ff] bg-[#ecf4ff] text-[11px] text-[#3f4a5f]">
                      <th className="px-3 py-2">التاريخ</th>
                      <th className="px-3 py-2">المستخدم</th>
                      <th className="px-3 py-2 hidden lg:table-cell">الجامعة</th>
                      <th className="px-3 py-2">الإجراء</th>
                      <th className="px-3 py-2">الوصف</th>
                      <th className="px-3 py-2 hidden xl:table-cell">الهدف</th>
                      <th className="px-3 py-2 hidden xl:table-cell">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-[#eef2ff] text-[11px] hover:bg-[#f9fbff]"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          {log.created_at
                            ? new Date(log.created_at).toLocaleString("ar-SA")
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          {log.actor
                            ? `${log.actor.first_name || ""} ${log.actor.last_name || ""}`.trim() || "—"
                            : "—"}
                        </td>
                        <td className="px-3 py-2 hidden lg:table-cell">
                          {log.university_name || "—"}
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[10px] text-[#1d72dd]">
                            {log.action || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="line-clamp-2" title={log.description || ""}>
                            {log.description || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2 hidden xl:table-cell">
                          {log.target_type && log.target_id
                            ? `${log.target_type} (${log.target_id.substring(0, 8)}...)`
                            : "—"}
                        </td>
                        <td className="px-3 py-2 hidden xl:table-cell">
                          {log.ip_address || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




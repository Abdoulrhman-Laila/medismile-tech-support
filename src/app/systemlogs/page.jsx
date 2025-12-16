"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addLog,
  deleteLog,
  clearLogs,
  setSearch,
  setFilterType,
} from "@/redux/slices/logsSlice";

import {
  Trash2,
  Filter,
  Search,
  Download,
  AlertCircle,
  Info,
  XCircle,
  FileText,
} from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";

export default function LogsPage() {
  const dispatch = useDispatch();
  const { logs, search, filterType } = useSelector((state) => state.logs);

  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.message.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "الكل" || log.type === filterType;
    return matchSearch && matchType;
  });

  const exportCSV = () => {
    const header = "ID,Type,Message,Date\n";
    const rows = logs.map(
      (log) => `${log.id},${log.type},${log.message},${log.date}`
    ).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "معلومة":
        return <Info className="text-blue-600" size={18} />;
      case "تحذير":
        return <AlertCircle className="text-yellow-600" size={18} />;
      case "خطأ":
        return <XCircle className="text-red-600" size={18} />;
      default:
        return null;
    }
  };

  const headerMeta = [
    { label: "إجمالي السجلات", value: logs.length },
    { label: "المعروضة", value: filteredLogs.length },
    { label: "نوع الفلتر", value: filterType },
  ];

  const inputBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";
  const selectBaseClass = inputBaseClass;

  const statusTone = (type) => {
    switch (type) {
      case "معلومة":
        return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(43,164,240,0.16)] text-[#1c7db5]";
      case "تحذير":
        return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(248,178,60,0.16)] text-[#b4731f]";
      case "خطأ":
        return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(234,84,85,0.16)] text-[#a73536]";
      default:
        return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="إدارة السجلات التقنية"
        description="تابع جميع السجلات التقنية للحفاظ على أداء النظام واستقراره."
        meta={headerMeta}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={Download} onClick={exportCSV}>
              تصدير السجلات
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => dispatch(clearLogs())}>
              تفريغ الكل
            </Button>
          </div>
        }
      />

      <Card tone="outline" padding="p-5">
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a94]" />
            <input
              type="text"
              placeholder="ابحث في السجلات..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className={`${inputBaseClass} pr-10`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-[#6b7a94]" size={18} />
            <select
              value={filterType}
              onChange={(e) => dispatch(setFilterType(e.target.value))}
              className={selectBaseClass}
            >
              <option value="الكل">الكل</option>
              <option value="معلومة">معلومة</option>
              <option value="تحذير">تحذير</option>
              <option value="خطأ">خطأ</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="سجل السجلات" icon={FileText}>
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">النوع</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الوصف</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">التاريخ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length ? (
                  filteredLogs.map((log, idx) => (
                    <tr key={log.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{idx + 1}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {getTypeIcon(log.type)}
                          <span className={statusTone(log.type)}>{log.type}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] break-words">{log.message}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-xs text-[#6b7a94] whitespace-nowrap hidden xl:table-cell">{log.date}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        <Button variant="danger" size="sm" onClick={() => dispatch(deleteLog(log.id))} className="text-xs sm:text-sm">
                          حذف
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد سجلات حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94]">ابدأ بإضافة سجل جديد</p>
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
          {filteredLogs.length ? (
            filteredLogs.map((log, idx) => (
              <div key={log.id} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7a94]">#{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span className={statusTone(log.type)}>{log.type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#0f1f3f] leading-relaxed break-words">{log.message}</p>
                  <div className="flex items-center justify-between text-xs text-[#6b7a94] pt-2">
                    <span>📅 {log.date}</span>
                    <Button variant="danger" size="sm" onClick={() => dispatch(deleteLog(log.id))} className="text-xs">
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full px-4 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <FileText className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد سجلات حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإضافة سجل جديد</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

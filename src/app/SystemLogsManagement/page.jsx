"use client";
import { useSelector, useDispatch } from "react-redux";
import { setSearch, setFilter, deleteLog, clearLogs } from "../../redux/slices/systemMonitoringSlice";
import { Download, Trash2, Filter, Search, FileText } from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";

export default function LogsManagementPage() {
  const dispatch = useDispatch();
  const { systemLogsManagement, search, filter } = useSelector(state => state.systemLogsManagement);

  const filteredLogs = systemLogsManagement.filter(log => {
    const matchType = filter === "الكل" || log.type === filter;
    const matchSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.date.includes(search);
    return matchType && matchSearch;
  });

  const downloadLogs = () => {
    const content = systemLogsManagement.map(l => `[${l.date}] (${l.type}): ${l.message}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "system-logs.txt";
    link.click();
  };

  const headerMeta = [
    { label: "إجمالي السجلات", value: systemLogsManagement.length },
    { label: "بعد التصفية", value: filteredLogs.length },
    { label: "نوع الفلتر", value: filter },
  ];

  const inputBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";
  const selectBaseClass = inputBaseClass;

  const statusTone = (type) => {
    if (type === "خطأ") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(234,84,85,0.16)] text-[#a73536]";
    if (type === "تحذير") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(248,178,60,0.16)] text-[#b4731f]";
    if (type === "معلومة") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(43,164,240,0.16)] text-[#1c7db5]";
    return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="إدارة السجلات التقنية"
        description="تحكم كامل في سجلات النظام مع خيارات التصفية والتنزيل."
        meta={headerMeta}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={Download} onClick={downloadLogs}>
              تنزيل السجلات
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => dispatch(clearLogs())}>
              مسح الكل
            </Button>
          </div>
        }
      />

      <Card tone="outline" padding="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a94]" />
            <input
              type="text"
              placeholder="ابحث في السجلات..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className={`${inputBaseClass} pr-10`}
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-[#6b7a94]" />
            <select
              value={filter}
              onChange={(e) => dispatch(setFilter(e.target.value))}
              className={selectBaseClass}
            >
              <option value="الكل">الكل</option>
              <option value="خطأ">أخطاء</option>
              <option value="تحذير">تحذيرات</option>
              <option value="معلومة">معلومات</option>
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
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">رقم</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">النوع</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الرسالة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">التاريخ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{log.id}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        <span className={statusTone(log.type)}>{log.type}</span>
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
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد سجلات مطابقة</p>
                        <p className="text-sm sm:text-base text-[#6b7a94]">جرب تغيير الفلتر أو البحث</p>
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
            filteredLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#6b7a94]">رقم السجل</p>
                      <p className="text-base font-semibold text-[#0f1f3f]">#{log.id}</p>
                    </div>
                    <span className={statusTone(log.type)}>{log.type}</span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-[#3f4a5f] break-words">{log.message}</p>
                    <p className="text-xs text-[#6b7a94]">📅 {log.date}</p>
                  </div>
                  <div className="pt-2">
                    <Button variant="danger" size="sm" onClick={() => dispatch(deleteLog(log.id))} className="text-xs w-full">
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
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد سجلات مطابقة</p>
                <p className="text-sm text-[#6b7a94]">جرب تغيير الفلتر أو البحث</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  addBackup,
  updateBackupStatus,
  deleteBackup,
  setAutoBackup,
} from "@/redux/slices/backupSlice";
import { PageHeader, Card, Button } from "@/components/ui";
import { HardDrive, UploadCloud, PlusCircle, RefreshCcw, Download, Trash2 } from "lucide-react";

export default function BackupManagementPage() {
  const dispatch = useDispatch();
  const { backups, autoBackup } = useSelector((state) => state.backups);

  // إنشاء نسخة جديدة
  const createBackup = () => {
    const newBackup = {
      id: backups.length + 1,
      date: new Date().toLocaleString(),
      size: `${(Math.random() * 2).toFixed(2)} GB`,
      status: "قيد التنفيذ",
    };
    dispatch(addBackup(newBackup));

    setTimeout(() => {
      dispatch(updateBackupStatus({ id: newBackup.id, status: "ناجحة" }));
    }, 2000);
  };

  // استعادة نسخة
  const restoreBackup = (id) => {
    alert(`🔄 جاري استعادة النسخة رقم ${id} ...`);
  };

  // حذف نسخة
  const handleDelete = (id) => {
    dispatch(deleteBackup(id));
  };

  // تنزيل نسخة
  const downloadBackup = (backup) => {
    alert(`⬇️ جاري تنزيل النسخة رقم ${backup.id} بحجم ${backup.size}`);
  };

  // رفع نسخة يدوياً
  const uploadBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newBackup = {
      id: backups.length + 1,
      date: new Date().toLocaleString(),
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      status: "ناجحة",
      name: file.name,
    };
    dispatch(addBackup(newBackup));
  };

  const lastBackup = backups.length ? backups[backups.length - 1] : null;
  const headerMeta = [
    { label: "إجمالي النسخ", value: backups.length },
    { label: "النسخ التلقائي", value: autoBackup },
    lastBackup && { label: "آخر نسخة", value: lastBackup.date },
  ].filter(Boolean);

  const selectBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";

  const statusTone = (status) => {
    if (status === "ناجحة") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(48,185,128,0.12)] text-[#1f8d62]";
    if (status === "قيد التنفيذ") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(43,164,240,0.16)] text-[#1c7db5]";
    if (status === "فشلت") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(234,84,85,0.16)] text-[#a73536]";
    return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(248,178,60,0.16)] text-[#b4731f]";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="إدارة النسخ الاحتياطية"
        description="تابع حالة النسخ الاحتياطية، أنشئ نسخاً جديدة، واضبط جداول النسخ التلقائي لحماية بياناتك."
        meta={headerMeta}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={PlusCircle} onClick={createBackup}>
              إنشاء نسخة جديدة
            </Button>
            <Button as="label" variant="secondary" icon={UploadCloud}>
              رفع نسخة
              <input type="file" onChange={uploadBackup} className="hidden" />
            </Button>
          </div>
        }
      />

      <Card
        title="النسخ المتوفرة"
        description="تعرف على حالة كل نسخة احتياطية وتحكم بها بسهولة."
        icon={HardDrive}
      >
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">رقم النسخة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">التاريخ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الحجم</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {backups.length ? (
                  backups.map((backup) => (
                    <tr key={backup.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-[#1d72dd]">#{backup.id}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f]">{backup.date}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f]">{backup.size}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        <span className={statusTone(backup.status)}>{backup.status}</span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={RefreshCcw}
                            onClick={() => restoreBackup(backup.id)}
                            className="text-xs sm:text-sm"
                          >
                            استعادة
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Download}
                            onClick={() => downloadBackup(backup)}
                            className="text-xs sm:text-sm"
                          >
                            تنزيل
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(backup.id)}
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
                    <td colSpan={5} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <HardDrive className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد نسخ احتياطية حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94]">ابدأ بإنشاء نسخة جديدة</p>
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
          {backups.length ? (
            backups.map((backup) => (
              <div key={backup.id} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#6b7a94]">نسخة رقم</p>
                      <h3 className="text-base font-semibold text-[#0f1f3f]">#{backup.id}</h3>
                    </div>
                    <span className={statusTone(backup.status)}>{backup.status}</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-[#3f4a5f]">
                    <p>📅 {backup.date}</p>
                    <p>💾 {backup.size}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={RefreshCcw}
                      onClick={() => restoreBackup(backup.id)}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      استعادة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      onClick={() => downloadBackup(backup)}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      تنزيل
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(backup.id)}
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
                <HardDrive className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد نسخ احتياطية حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإنشاء نسخة جديدة</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="إعدادات النسخ التلقائي"
        description="اضبط تكرار النسخ التلقائي لضمان وجود نسخة حديثة دائماً."
        icon={RefreshCcw}
        footer={
          <p className="text-sm text-[#6b7a94]">
            📌 حالياً النسخ التلقائي مضبوط على{" "}
            <span className="font-semibold text-[#0f1f3f]">{autoBackup}</span>
          </p>
        }
      >
        <div className="max-w-sm space-y-3">
          <label className="text-sm font-medium text-[#3f4a5f]">
            اختر تكرار النسخ التلقائي
          </label>
          <select
            value={autoBackup}
            onChange={(e) => dispatch(setAutoBackup(e.target.value))}
            className={selectBaseClass}
          >
            <option value="يومي">يومي</option>
            <option value="أسبوعي">أسبوعي</option>
            <option value="شهري">شهري</option>
          </select>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card } from "@/components/ui";
import {
  fetchAttachments,
  getAttachmentDetails,
  setAttachmentsFilters,
  clearAttachmentsError,
} from "@/redux/slices/attachmentsSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function AttachmentsPage() {
  const dispatch = useDispatch();
  const { attachments, currentAttachment, loading, error, filters } = useSelector(
    (state) => state.attachments
  );

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAttachments(filters));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAttachments(filters));
  };

  const handleFilterChange = (key, value) => {
    const normalized = value || null;
    const next = { ...filters, [key]: normalized };
    dispatch(setAttachmentsFilters({ [key]: normalized }));
    dispatch(fetchAttachments(next));
  };

  const handleSelectAttachment = async (att) => {
    if (!att?.id) return;
    setSelectedId(att.id);
    try {
      await dispatch(getAttachmentDetails(att.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل المرفق:", err);
    }
  };

  const filteredAttachments = useMemo(
    () =>
      (attachments || []).filter((a) => {
        if (filters.mime_type && a.mime_type !== filters.mime_type) return false;
        if (filters.attachment_type && a.attachment_type !== filters.attachment_type) return false;
        if (filters.case_session_id && a.case_session?.id !== filters.case_session_id)
          return false;
        return true;
      }),
    [attachments, filters]
  );

  const headerMeta = [
    { label: "إجمالي المرفقات", value: attachments?.length ?? 0 },
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
          title="المرفقات"
          description="عرض المرفقات المرتبطة بالحالات والجلسات (قراءة فقط)."
          icon={FileText}
          meta={headerMeta}
          actions={
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl border border-[#8aa7d6] px-3 py-2 text-xs text-[#1d72dd]"
            >
              <RefreshCcw className="h-3 w-3" />
              تحديث
            </button>
          }
        />

        {error && (
          <Card tone="danger">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                className="text-xs text-[#1d72dd]"
                onClick={() => dispatch(clearAttachmentsError())}
              >
                إغلاق
              </button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* الفلاتر وقائمة المرفقات */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-[#6b7a94] mb-1.5">نوع المرفق</label>
                  <select
                    className={inputBaseClass}
                    value={filters.attachment_type || ""}
                    onChange={(e) => handleFilterChange("attachment_type", e.target.value)}
                  >
                    <option value="">كل الأنواع</option>
                    <option value="image">صورة</option>
                    <option value="document">مستند</option>
                    <option value="video">فيديو</option>
                    <option value="audio">صوت</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card
              title="قائمة المرفقات"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل المرفقات...</p>
              )}
              {!loading && filteredAttachments.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد مرفقات مطابقة للفلتر الحالي.
                </p>
              )}
              <ul className="space-y-2">
                {filteredAttachments.map((att) => {
                  const isActiveRow = selectedId === att.id;
                  return (
                    <li key={att.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectAttachment(att)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {att.original_filename || "مرفق بدون اسم"}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {att.mime_type || att.attachment_type || "غير محدد"}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>{att.uploaded_by ? `${att.uploaded_by.first_name} ${att.uploaded_by.last_name}` : "غير محدد"}</span>
                          <span>{att.file_size ? `${(att.file_size / 1024).toFixed(2)} KB` : "غير محدد"}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل المرفق */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentAttachment ? "تفاصيل المرفق" : "لا يوجد مرفق محدد"}
              tone="outline"
              icon={FileText}
            >
              {currentAttachment ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4b5563] mt-2">
                    <div>
                      <span className="font-semibold">الاسم:</span>{" "}
                      <span>
                        {currentAttachment.original_filename || "غير متوفر"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">نوع المرفق:</span>{" "}
                      <span>{currentAttachment.attachment_type || "غير محدد"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">فئة الملف:</span>{" "}
                      <span>{currentAttachment.file_category || "غير محدد"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">نوع MIME:</span>{" "}
                      <span>{currentAttachment.mime_type || "غير معروف"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">الحجم:</span>{" "}
                      <span>
                        {currentAttachment.file_size
                          ? `${(currentAttachment.file_size / 1024).toFixed(2)} KB (${currentAttachment.file_size} bytes)`
                          : "غير معروف"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">مرئي للمريض:</span>{" "}
                      <span>{currentAttachment.is_visible_to_patient ? "نعم" : "لا"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">رفعه:</span>{" "}
                      <span>
                        {currentAttachment.uploaded_by
                          ? `${currentAttachment.uploaded_by.first_name} ${currentAttachment.uploaded_by.last_name} (${currentAttachment.uploaded_by.role || "غير محدد"})`
                          : "غير محدد"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">تاريخ الرفع:</span>{" "}
                      <span>
                        {currentAttachment.created_at
                          ? new Date(currentAttachment.created_at).toLocaleString("ar-SA")
                          : "غير محدد"}
                      </span>
                    </div>
                  </div>
                  {currentAttachment.file_url && (
                    <a
                      href={currentAttachment.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#1d72dd] hover:underline"
                    >
                      فتح/تحميل المرفق
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر مرفقاً من القائمة اليمنى لعرض تفاصيله.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchPosts,
  getPostDetails,
  fetchApprovalLogsThunk,
  setCommunityFilters,
  clearCommunityError,
} from "@/redux/slices/communitySlice";
import { FileText, RefreshCcw, ListChecks } from "lucide-react";

export default function CommunityPage() {
  const dispatch = useDispatch();
  const { posts, content, currentPost, currentContent, approvalLogs, loading, error, filters } =
    useSelector((state) => state.community);
  const { role } = useSelector((state) => state.auth);
  
  const isTechSupport = role === "tech_support" || role === "tech-support";
  const isUniversityAdmin = role === "university_admin" || role === "university-admin";

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // جلب Posts باستخدام الـ endpoint الجديد
    const queryParams = {};
    if (filters.status) queryParams.status = filters.status;
    if (filters.author_id) queryParams.author_id = filters.author_id;
    if (filters.content_type) queryParams.content_type = filters.content_type;
    
    dispatch(fetchPosts(queryParams));
    
    // جلب Approval Logs للـ tech_support و university_admin
    if (isTechSupport || isUniversityAdmin) {
      dispatch(fetchApprovalLogsThunk());
    }
  }, [dispatch, isTechSupport, isUniversityAdmin]);

  const handleRefresh = () => {
    const queryParams = {};
    if (filters.status) queryParams.status = filters.status;
    if (filters.author_id) queryParams.author_id = filters.author_id;
    if (filters.content_type) queryParams.content_type = filters.content_type;
    
    dispatch(fetchPosts(queryParams));
    
    if (isTechSupport || isUniversityAdmin) {
      dispatch(fetchApprovalLogsThunk());
    }
  };

  const handleFilterChange = (key, value) => {
    const normalized =
      key === "featured"
        ? value === ""
          ? null
          : value === "true"
        : value || null;
    const next = { ...filters, [key]: normalized };
    dispatch(setCommunityFilters({ [key]: normalized }));
    dispatch(fetchContent(next));
  };

  const handleSelectPost = async (item) => {
    if (!item?.id) return;
    setSelectedId(item.id);
    try {
      await dispatch(getPostDetails(item.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل الـ Post:", err);
    }
  };

  // استخدام posts أو content (legacy support)
  const displayPosts = posts && posts.length > 0 ? posts : (content || []);

  const filteredContent = useMemo(() => {
    return (displayPosts || []).filter((c) => {
      if (filters.content_type && c.content_type !== filters.content_type) return false;
      if (filters.category && c.category !== filters.category) return false;
      if (filters.university && c.university?.id !== filters.university) return false;
      if (filters.status && c.status !== filters.status) return false;
      return true;
    });
  }, [displayPosts, filters]);

  const headerMeta = [
    { label: "إجمالي Posts", value: displayPosts?.length ?? 0 },
    {
      label: "Posts المعلقة",
      value: (displayPosts || []).filter((c) => c.status === "pending").length,
    },
    {
      label: "Posts الموافق عليها",
      value: (displayPosts || []).filter((c) => c.status === "approved").length,
    },
  ];
  
  if (isTechSupport || isUniversityAdmin) {
    headerMeta.push({
      label: "سجلات الموافقة",
      value: approvalLogs?.length ?? 0,
    });
  }

  const inputBaseClass =
    "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 text-sm text-[#0f1f3f] outline-none";

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="المحتوى المجتمعي"
          description="مراقبة المحتوى التعليمي والطبي المنشور في النظام."
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
                onClick={() => dispatch(clearCommunityError())}
              >
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* الفلاتر وقائمة المحتوى */}
          <div className="space-y-4 lg:col-span-1">
            <Card title="الفلاتر" tone="outline">
              <div className="space-y-3 text-sm">
                <select
                  className={inputBaseClass}
                  value={filters.content_type || ""}
                  onChange={(e) => handleFilterChange("content_type", e.target.value)}
                >
                  <option value="">كل أنواع المحتوى</option>
                  <option value="text">نص</option>
                  <option value="video">فيديو</option>
                  <option value="image">صورة</option>
                  <option value="document">مستند</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">كل الحالات</option>
                  <option value="pending">معلق</option>
                  <option value="approved">موافق عليه</option>
                  <option value="rejected">مرفوض</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={filters.category || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="">كل الفئات</option>
                  <option value="medical">طبي</option>
                  <option value="educational">تعليمي</option>
                  <option value="research">بحثي</option>
                  <option value="news">أخبار</option>
                  <option value="general">عام</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة المحتوى"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل المحتوى...</p>
              )}
              {!loading && filteredContent.length === 0 && (
                <p className="text-sm text-[#6b7a94]">
                  لا يوجد محتوى مطابق للفلتر الحالي.
                </p>
              )}
              <ul className="space-y-2">
                {filteredContent.map((item) => {
                  const isActiveRow = selectedId === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectPost(item)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActiveRow
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {item.title}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {item.content_type}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                          <span>{item.category}</span>
                          <span>{item.university?.name || "—"}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل المحتوى + المحتوى الرائج */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentPost || currentContent ? "تفاصيل Post" : "لا يوجد عنصر محدد"}
              tone="outline"
              icon={FileText}
            >
              {(currentPost || currentContent) ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {(currentPost || currentContent).content_type || "—"}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 ${
                      (currentPost || currentContent).status === "approved" ? "bg-green-100 text-green-700" :
                      (currentPost || currentContent).status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      (currentPost || currentContent).status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {(currentPost || currentContent).status || "—"}
                    </span>
                    {(currentPost || currentContent).category && (
                      <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                        {(currentPost || currentContent).category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3f]">
                    {(currentPost || currentContent).title}
                  </h3>
                  {(currentPost || currentContent).content && (
                    <p className="whitespace-pre-line text-sm text-[#3f4a5f]">
                      {(currentPost || currentContent).content}
                    </p>
                  )}
                  {(currentPost || currentContent).tags && (
                    <p className="text-xs text-[#6b7a94]">
                      الوسوم: {(currentPost || currentContent).tags}
                    </p>
                  )}
                  {(currentPost || currentContent).author && (
                    <p className="text-xs text-[#6b7a94]">
                      المؤلف: {(currentPost || currentContent).author?.username || 
                               (currentPost || currentContent).author?.email || 
                               (currentPost || currentContent).author?.full_name || "—"}
                    </p>
                  )}
                  {(currentPost || currentContent).created_at && (
                    <p className="text-xs text-[#6b7a94]">
                      تاريخ الإنشاء: {new Date((currentPost || currentContent).created_at).toLocaleDateString('ar-EG')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر Post من القائمة اليمنى لعرض تفاصيله.
                </p>
              )}
            </Card>

            {/* Approval Logs للـ tech_support و university_admin */}
            {(isTechSupport || isUniversityAdmin) && (
              <Card title="سجلات الموافقة" tone="outline" icon={ListChecks}>
                {loading && approvalLogs.length === 0 ? (
                  <p className="text-sm text-[#6b7a94]">جاري تحميل سجلات الموافقة...</p>
                ) : approvalLogs && approvalLogs.length > 0 ? (
                  <div className="space-y-3">
                    {approvalLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-lg border border-[#e5e7eb] bg-white p-3 text-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f]">
                            {log.post_title || "Post"}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                            log.decision === "approved" ? "bg-green-100 text-green-700" :
                            log.decision === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {log.decision === "approved" ? "موافق عليه" : 
                             log.decision === "rejected" ? "مرفوض" : 
                             log.decision || "—"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-[#6b7a94]">
                          {log.author_name && (
                            <p>المؤلف: {log.author_name}</p>
                          )}
                          {log.author_email && (
                            <p>البريد الإلكتروني: {log.author_email}</p>
                          )}
                          {log.supervisor_name && (
                            <p>المشرف الموافق: {log.supervisor_name}</p>
                          )}
                          {log.supervisor_email && (
                            <p>البريد الإلكتروني للمشرف: {log.supervisor_email}</p>
                          )}
                          {log.reason && (
                            <p>السبب: {log.reason}</p>
                          )}
                          <p>التاريخ: {log.created_at ? new Date(log.created_at).toLocaleDateString('ar-EG', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : "—"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6b7a94]">
                    لا توجد سجلات موافقة حالياً.
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




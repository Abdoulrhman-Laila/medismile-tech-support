"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchContent,
  getContentDetails,
  getTrendingContentThunk,
  setCommunityFilters,
  clearCommunityError,
} from "@/redux/slices/communitySlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function CommunityPage() {
  const dispatch = useDispatch();
  const { content, currentContent, trendingContent, loading, error, filters } =
    useSelector((state) => state.community);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchContent(filters));
    dispatch(getTrendingContentThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchContent(filters));
    dispatch(getTrendingContentThunk());
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

  const handleSelectContent = async (item) => {
    if (!item?.id) return;
    setSelectedId(item.id);
    try {
      await dispatch(getContentDetails(item.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب تفاصيل المحتوى:", err);
    }
  };

  const filteredContent = useMemo(() => {
    return (content || []).filter((c) => {
      if (filters.type && c.content_type !== filters.type) return false;
      if (filters.category && c.category !== filters.category) return false;
      if (filters.university && c.university?.id !== filters.university) return false;
      if (typeof filters.featured === "boolean" && c.is_featured !== filters.featured)
        return false;
      if (filters.status && c.status !== filters.status) return false;
      return true;
    });
  }, [content, filters]);

  const headerMeta = [
    { label: "إجمالي المحتوى", value: content?.length ?? 0 },
    {
      label: "المحتوى المميز",
      value: (content || []).filter((c) => c.is_featured).length,
    },
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
                  value={filters.type || ""}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">كل الأنواع</option>
                  <option value="article">مقال</option>
                  <option value="video">فيديو</option>
                  <option value="document">مستند</option>
                  <option value="image">صورة</option>
                  <option value="link">رابط</option>
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
                <select
                  className={inputBaseClass}
                  value={
                    typeof filters.featured === "boolean"
                      ? String(filters.featured)
                      : ""
                  }
                  onChange={(e) => handleFilterChange("featured", e.target.value)}
                >
                  <option value="">الكل (مميز/عادي)</option>
                  <option value="true">محتوى مميز فقط</option>
                  <option value="false">غير مميز</option>
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
                        onClick={() => handleSelectContent(item)}
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
              title={currentContent ? "تفاصيل المحتوى" : "لا يوجد عنصر محدد"}
              tone="outline"
              icon={FileText}
            >
              {currentContent ? (
                <div className="space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                    <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                      {currentContent.content_type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                      {currentContent.status}
                    </span>
                    {currentContent.is_featured && (
                      <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5">
                        مميز
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3f]">
                    {currentContent.title}
                  </h3>
                  {currentContent.description && (
                    <p className="whitespace-pre-line text-sm text-[#3f4a5f]">
                      {currentContent.description}
                    </p>
                  )}
                  {currentContent.tags && (
                    <p className="text-xs text-[#6b7a94]">
                      الوسوم: {currentContent.tags}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر عنصراً من القائمة اليمنى لعرض تفاصيله.
                </p>
              )}
            </Card>

            <Card title="المحتوى الرائج" tone="outline">
              {trendingContent && trendingContent.length > 0 ? (
                <ul className="space-y-2 text-sm text-[#0f1f3f]">
                  {trendingContent.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-white px-3 py-2"
                    >
                      <span className="line-clamp-1">{item.title}</span>
                      <span className="text-[11px] text-[#6b7a94]">
                        {(item.view_count ?? 0) + " مشاهدة"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  لا يوجد محتوى رائج حالياً حسب البيانات المتاحة.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}




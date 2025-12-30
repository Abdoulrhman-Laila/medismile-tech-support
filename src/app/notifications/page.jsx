"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import { fetchNotifications, clearNotificationsError } from "@/redux/slices/notificationsSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotifications());
  };

  const headerMeta = [
    { label: "إجمالي الإشعارات", value: notifications?.length ?? 0 },
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
          title="الإشعارات"
          description="عرض جميع الإشعارات الخاصة بالدعم التقني."
          icon={FileText}
          meta={headerMeta}
          actions={
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCcw}
              onClick={handleRefresh}
            >
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
                onClick={() => dispatch(clearNotificationsError())}
              >
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <Card title="قائمة الإشعارات" tone="outline" className="space-y-4">
          {loading && (
            <p className="text-sm text-[#6b7a94]">جاري تحميل الإشعارات...</p>
          )}
          {!loading && notifications.length === 0 && (
            <p className="text-sm text-[#6b7a94]">لا توجد إشعارات.</p>
          )}
          {!loading && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-[#d6e4ff] bg-white p-4 hover:bg-[#f5f7ff] transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[#0f1f3f] mb-1">
                        {notification.title || notification.message || "إشعار"}
                      </h3>
                      {notification.message && (
                        <p className="text-sm text-[#3f4a5f] whitespace-pre-line">
                          {notification.message}
                        </p>
                      )}
                      {notification.created_at && (
                        <p className="text-xs text-[#6b7a94] mt-2">
                          {new Date(notification.created_at).toLocaleString("ar-SA")}
                        </p>
                      )}
                    </div>
                    {notification.notification_type && (
                      <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-1 text-xs text-[#1d72dd]">
                        {notification.notification_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}

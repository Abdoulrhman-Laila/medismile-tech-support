"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FileText, LogOut, RefreshCcw, Clock, User, Activity } from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";
import ProtectedRoute from "@/components/ProtectedRoute";
import { logout } from "@/redux/slices/authSlice";
import { fetchAuditLogs, clearAuditError } from "@/redux/slices/auditSlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { logs, loading: auditLoading, error: auditError } = useSelector((state) => state.audit);

  useEffect(() => {
    if (!authLoading) {
      // جلب سجلات التدقيق عند تحميل الصفحة
      dispatch(fetchAuditLogs({ limit: 10 })); // آخر 10 سجلات
    }
  }, [dispatch, authLoading]);

  const handleRefresh = () => {
    dispatch(fetchAuditLogs({ limit: 10 }));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.replace("/login");
    } catch (error) {
      // حتى لو فشل logout في السيرفر، نتابع التوجيه
      router.replace("/login");
    }
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "create":
      case "update":
      case "delete":
        return <Activity className="h-4 w-4" />;
      case "login":
      case "logout":
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case "create":
        return "bg-green-100 text-green-700";
      case "update":
        return "bg-blue-100 text-blue-700";
      case "delete":
        return "bg-red-100 text-red-700";
      case "login":
        return "bg-purple-100 text-purple-700";
      case "logout":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const headerMeta = [
    user?.email && { label: "البريد الإلكتروني", value: user.email },
    user?.role && { label: "الدور", value: user.role },
    { label: "عدد السجلات", value: logs?.length ?? 0 },
  ].filter(Boolean);

  return (
    <ProtectedRoute>
      {!user ? null : (
        <div className="page-container">
          <PageHeader
            title={`مرحباً ${(user.first_name || user.name || user.username || "").trim()} 👋`}
            description="تابع آخر النشاطات وسجلات التدقيق في النظام."
            meta={headerMeta}
            actions={
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" icon={RefreshCcw} onClick={handleRefresh}>
                  تحديث
                </Button>
                <Button variant="outline" icon={LogOut} onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              </div>
            }
          />

          {auditError && (
            <Card tone="danger">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-red-700">{auditError}</p>
                <Button size="xs" variant="ghost" onClick={() => dispatch(clearAuditError())}>
                  إغلاق
                </Button>
              </div>
            </Card>
          )}

          <Card
            title="آخر سجلات التدقيق"
            description="عرض آخر النشاطات والإجراءات في النظام."
            icon={FileText}
          >
            {auditLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-sm text-gray-600">جاري تحميل السجلات...</p>
                </div>
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-3">
                {logs.slice(0, 10).map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="rounded-xl border border-[#d6e4ff] bg-white p-4 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getActionColor(log.action)}`}>
                              {log.action || "غير محدد"}
                            </span>
                            {log.content_type && (
                              <span className="text-xs text-[#6b7a94]">
                                {log.content_type}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-[#0f1f3f] break-words">
                            {log.message || log.description || "لا يوجد وصف"}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-[#6b7a94]">
                            {log.user_name && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.user_name}
                              </span>
                            )}
                            {log.timestamp && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(log.timestamp).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                            {log.created_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(log.created_at).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {logs.length >= 10 && (
                  <div className="pt-2 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/audit")}
                    >
                      عرض جميع السجلات
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#8aa7d6] bg-[#ecf4ff] p-10 text-center">
                <FileText className="mb-4 h-10 w-10 text-[#1d72dd]" />
                <h3 className="text-lg font-semibold text-[#0f1f3f]">
                  لا توجد سجلات تدقيق حالياً
                </h3>
                <p className="mt-2 max-w-md text-sm text-[#6b7a94]">
                  سيتم عرض سجلات التدقيق هنا عندما تحدث نشاطات في النظام.
                </p>
                <Button
                  className="mt-4"
                  variant="secondary"
                  onClick={() => router.push("/audit")}
                >
                  الذهاب إلى صفحة سجلات التدقيق
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </ProtectedRoute>
  );
}

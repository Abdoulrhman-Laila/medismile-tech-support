"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card } from "@/components/ui";
import { Users } from "lucide-react";
import { getTechSupportDetails } from "@/api/accountsApi";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        // ⬅️ الالتزام بالـ endpoint للدعم التقني:
        // GET /api/accounts/system/tech-support/<user_id>/
        const res = await getTechSupportDetails(user.id);
        const data = res?.data ?? res ?? null;
        setProfile(data);
      } catch (err) {
        console.error("❌ خطأ في جلب ملف المستخدم:", err.response?.data || err.message);
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "فشل في جلب بيانات الملف الشخصي";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const baseUser = user || {};
  const effectiveProfile = profile || {};

  const fullName =
    effectiveProfile.full_name ||
    `${effectiveProfile.first_name || baseUser.first_name || ""} ${
      effectiveProfile.last_name || baseUser.last_name || ""
    }`.trim() ||
    baseUser.username ||
    baseUser.email ||
    "";

  const headerMeta = [
    baseUser.email && { label: "البريد الإلكتروني", value: baseUser.email },
    (effectiveProfile.role || baseUser.role) && {
      label: "الدور",
      value: effectiveProfile.role || baseUser.role,
    },
    effectiveProfile.university_name && {
      label: "الجامعة",
      value: effectiveProfile.university_name,
    },
  ].filter(Boolean);

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title={fullName ? `الملف الشخصي – ${fullName}` : "الملف الشخصي"}
          description="عرض بيانات حساب الدعم التقني كما هي مسجلة في نظام MediSmile."
          icon={Users}
          meta={headerMeta}
        />

        {loading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 text-sm">جاري تحميل بيانات الملف الشخصي...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <Card tone="danger">
            <p className="text-sm text-red-700 text-center">{error}</p>
          </Card>
        )}

        {!loading && !error && (
          <Card tone="outline">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#0f1f3f]">
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">الاسم الكامل</p>
                <p className="font-semibold">
                  {fullName || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">البريد الإلكتروني</p>
                <p className="font-semibold">
                  {baseUser.email || effectiveProfile.email || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">اسم المستخدم</p>
                <p className="font-semibold">
                  {baseUser.username || effectiveProfile.username || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">الدور</p>
                <p className="font-semibold">
                  {effectiveProfile.role || baseUser.role || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">الجامعة</p>
                <p className="font-semibold">
                  {effectiveProfile.university_name || "غير محددة"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">رقم الهاتف</p>
                <p className="font-semibold">
                  {effectiveProfile.phone_number || "غير متوفر"}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}




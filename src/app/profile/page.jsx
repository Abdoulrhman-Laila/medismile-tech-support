"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card } from "@/components/ui";
import { Users } from "lucide-react";
import { fetchProfile } from "@/redux/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, profile, profileLoading, profileError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const baseUser = user || {};
  const effectiveProfile = profile || {};

  const fullName =
    effectiveProfile.full_name ||
    `${effectiveProfile.first_name || baseUser.first_name || ""} ${
      effectiveProfile.last_name || baseUser.last_name || ""
    }`.trim() ||
    baseUser.username ||
    baseUser.email ||
    effectiveProfile.username ||
    effectiveProfile.email ||
    "";

  const headerMeta = [
    (effectiveProfile.email || baseUser.email) && { 
      label: "البريد الإلكتروني", 
      value: effectiveProfile.email || baseUser.email 
    },
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

        {profileLoading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 text-sm">جاري تحميل بيانات الملف الشخصي...</p>
            </div>
          </div>
        )}

        {!profileLoading && profileError && (
          <Card tone="danger">
            <p className="text-sm text-red-700 text-center">{profileError}</p>
          </Card>
        )}

        {!profileLoading && !profileError && (
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
                  {effectiveProfile.email || baseUser.email || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">اسم المستخدم</p>
                <p className="font-semibold">
                  {effectiveProfile.username || baseUser.username || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a94] mb-1">الدور</p>
                <p className="font-semibold">
                  {effectiveProfile.role || baseUser.role || "غير متوفر"}
                </p>
              </div>
              {effectiveProfile.university_name && (
                <div>
                  <p className="text-xs text-[#6b7a94] mb-1">الجامعة</p>
                  <p className="font-semibold">
                    {effectiveProfile.university_name}
                  </p>
                </div>
              )}
              {effectiveProfile.phone_number && (
                <div>
                  <p className="text-xs text-[#6b7a94] mb-1">رقم الهاتف</p>
                  <p className="font-semibold">
                    {effectiveProfile.phone_number}
                  </p>
                </div>
              )}
              {effectiveProfile.department && (
                <div>
                  <p className="text-xs text-[#6b7a94] mb-1">القسم</p>
                  <p className="font-semibold">
                    {effectiveProfile.department}
                  </p>
                </div>
              )}
              {effectiveProfile.position && (
                <div>
                  <p className="text-xs text-[#6b7a94] mb-1">المنصب</p>
                  <p className="font-semibold">
                    {effectiveProfile.position}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}




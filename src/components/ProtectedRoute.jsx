"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const redirectingRef = useRef(false);

  useEffect(() => {
    // إذا لم نكن في حالة تحميل، والمستخدم غير مصادق، ولسنا في صفحة login → إعادة توجيه
    if (!loading && !isAuthenticated && !redirectingRef.current && pathname !== "/login") {
      redirectingRef.current = true;
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router, pathname]);

  // إذا كان المستخدم غير مصادق وما زال هناك تحميل → إظهار شاشة التحقق
  if (!isAuthenticated && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول (وبدون تحميل) → لا نعرض شيئاً (سيتم التوجيه في useEffect)
  if (!isAuthenticated && !loading) {
    return null;
  }

  // في جميع الحالات الأخرى (isAuthenticated = true) نعرض المحتوى حتى لو كان هناك تحميل خلفي
  return <>{children}</>;
}




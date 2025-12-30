"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { login } from "@/redux/slices/authSlice";

// أيقونات (Heroicons)
const EnvelopeIcon = dynamic(() =>
  import("@heroicons/react/24/outline").then((mod) => mod.EnvelopeIcon),
  { ssr: false }
);
const LockClosedIcon = dynamic(() =>
  import("@heroicons/react/24/outline").then((mod) => mod.LockClosedIcon),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const hasLoadedRef = useRef(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    // لا نحتاج لتحميل المصادقة هنا لأن AppLayout يقوم بذلك
    // فقط ننتظر حتى يتم التحميل
    const checkAuth = () => {
      if (!authLoading) {
        setLoading(false);
        hasLoadedRef.current = true;
      }
    };
    
    checkAuth();
    // إذا كان التحميل لا يزال جارياً، ننتظر قليلاً
    if (authLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
        hasLoadedRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  useEffect(() => {
    // إذا كان المستخدم مسجل دخول، نوجهه للصفحة الرئيسية
    // تجنب التوجيه المتكرر
    if (isAuthenticated && !authLoading && !loading && hasLoadedRef.current && !redirectingRef.current) {
      redirectingRef.current = true;
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // التحقق من البيانات
    if (!email.trim() || !password) {
      setError("يرجى إدخال البريد الإلكتروني (أو اسم المستخدم) وكلمة المرور");
      setSubmitting(false);
      return;
    }

    try {
      // استخدام email أو username (API يدعم كليهما)
      const result = await dispatch(login({ email: email.trim(), password })).unwrap();
      
      // إذا نجح تسجيل الدخول، سيتم التوجيه تلقائياً في useEffect
      if (result) {
        router.replace("/");
      }
    } catch (err) {
      // عرض رسالة الخطأ
      const errorMessage = typeof err === "string" ? err : "فشل في تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // سيتم التوجيه تلقائياً
  }

  return (
    <div dir="rtl">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-white p-1 flex items-center justify-center">
              <img
                src="/Screenshot_٢٠٢٥٠٩٠٨-١٢٣٢٥٥.jpg"
                alt="MediSmile Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mt-3">أهلاً بك</h2>
            <p className="text-gray-500 text-sm mt-1">سجل دخولك للوصول إلى لوحة التحكم</p>
          </div>

          {(error || authError) && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error || authError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <EnvelopeIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="text"
                placeholder="البريد الإلكتروني أو اسم المستخدم"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

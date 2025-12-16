"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // نتحقق من المفتاح الخاص بالمشروع
    const currentUser = JSON.parse(localStorage.getItem("mediSmile_currentUser") || "null");
    if (currentUser) {
      // إذا مسجل سابقاً نوجهه للرئيسية
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("يرجى إدخال اسم المستخدم، البريد الإلكتروني، وكلمة المرور");
      return;
    }

    const users = JSON.parse(localStorage.getItem("mediSmile_users") || "[]");
    const user = users.find(
      (u) =>
        (u.username || u.name || "").trim().toLowerCase() === username.trim().toLowerCase() &&
        (u.email || "").trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setError("البيانات غير صحيحة. تحقق من اسم المستخدم، البريد الإلكتروني، وكلمة المرور.");
      return;
    }

    localStorage.setItem("mediSmile_currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("mediSmile-user-login"));
    router.replace("/");
  };

  if (loading) return null;

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

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <EnvelopeIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative">
              <EnvelopeIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg"
            >
              إنشاء حساب جديد
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

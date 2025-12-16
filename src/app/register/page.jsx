"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// أيقونات
const UserIcon = dynamic(() =>
  import("@heroicons/react/24/outline").then((mod) => mod.UserIcon),
  { ssr: false }
);
const EnvelopeIcon = dynamic(() =>
  import("@heroicons/react/24/outline").then((mod) => mod.EnvelopeIcon),
  { ssr: false }
);
const LockClosedIcon = dynamic(() =>
  import("@heroicons/react/24/outline").then((mod) => mod.LockClosedIcon),
  { ssr: false }
);

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => setLoading(false), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const [firstNameRaw, ...restName] = fullName.trim().split(/\s+/);
    const firstName = firstNameRaw || normalizedUsername;
    const lastName = restName.length > 0 ? restName.join(" ") : firstName;

    const registrationPayload = {
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      password_confirm: confirmPassword || password,
      first_name: firstName,
      last_name: lastName,
      department: department.trim() || "",
      position: position.trim() || "",
    };

    if (phoneNumber.trim()) {
      registrationPayload.phone_number = phoneNumber.trim();
    }

    const users = JSON.parse(localStorage.getItem("mediSmile_users") || "[]");
    const duplicate = users.find(
      (userItem) =>
        (userItem.username || "").trim().toLowerCase() === normalizedUsername.toLowerCase() ||
        (userItem.email || "").trim().toLowerCase() === normalizedEmail
    );

    if (duplicate) {
      setError("اسم المستخدم أو البريد الإلكتروني مستخدم مسبقًا.");
      return;
    }

    const newUser = {
      ...registrationPayload,
      name: fullName.trim(),
      phone_number: registrationPayload.phone_number || "",
      role: "tech_support",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("mediSmile_users", JSON.stringify(users));
    localStorage.setItem("mediSmile_currentUser", JSON.stringify(newUser));

    window.dispatchEvent(new Event("mediSmile-user-login"));
    setSuccess("✅ تمت عملية التسجيل بنجاح! سيتم تحويلك الآن.");
    setTimeout(() => router.replace("/"), 800);
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
            <h2 className="text-xl font-semibold mt-3">أنشئ حسابك الجديد</h2>
            <p className="text-gray-500 text-sm mt-1">أدخل بياناتك لإنشاء حساب</p>
          </div>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3 text-center">{success}</p>}
            <div className="relative">
              <UserIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <input
              type="text"
              placeholder="القسم (اختياري)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="المنصب (اختياري)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="tel"
              placeholder="رقم الهاتف (اختياري)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <UserIcon className="h-5 w-5 absolute top-3 right-3 text-blue-500" />
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
              إنشاء حساب جديد
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

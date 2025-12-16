"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { University, CreditCard, ShieldCheck, HardDrive, Users, FileText, Activity, TrendingUp, LogOut } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader, Card, Button } from "@/components/ui";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // بيانات وهمية للمخططات
  const [performanceData] = useState([
    { time: "10:00", CPU: 30, RAM: 45, Disk: 60, Response: 120 },
    { time: "10:10", CPU: 50, RAM: 55, Disk: 65, Response: 180 },
    { time: "10:20", CPU: 40, RAM: 60, Disk: 70, Response: 150 },
    { time: "10:30", CPU: 70, RAM: 75, Disk: 80, Response: 200 },
    { time: "10:40", CPU: 65, RAM: 70, Disk: 78, Response: 170 },
  ]);

  useEffect(() => {
    const currentUser = localStorage.getItem("mediSmile_currentUser");
    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("mediSmile_currentUser");
    window.dispatchEvent(new Event("mediSmile-user-logout"));
    router.replace("/login");
  };

  if (loading) return null;
  if (!user) return null;

  const quickLinks = [
    {
      title: "إدارة الجامعات",
      description: "متابعة وإدارة الجامعات المسجلة.",
      href: "/universities",
      icon: University,
    },
    {
      title: "إدارة الدفع",
      description: "متابعة الدفعات والفواتير.",
      href: "/payments",
      icon: CreditCard,
    },
    {
      title: "إدارة الصلاحيات",
      description: "تعيين وإدارة صلاحيات المستخدمين.",
      href: "/permissions",
      icon: ShieldCheck,
    },
    {
      title: "إدارة النسخ الاحتياطي",
      description: "إنشاء واستعادة النسخ الاحتياطية.",
      href: "/backup-management",
      icon: HardDrive,
    },
    {
      title: "إدارة الحسابات",
      description: "التحكم بحسابات الجامعات والمستخدمين.",
      href: "/accounts",
      icon: Users,
    },
    {
      title: "إدارة السجلات التقنية",
      description: "عرض وتنظيم السجلات مع خيارات التصدير.",
      href: "/systemlogs",
      icon: FileText,
    },
  ];

  const headerMeta = [
    user?.email && { label: "البريد الإلكتروني", value: user.email },
    user?.role && { label: "الدور", value: user.role },
    user?.last_login && {
      label: "آخر تسجيل دخول",
      value: new Date(user.last_login).toLocaleString(),
    },
  ].filter(Boolean);

  const hasPerformanceData = performanceData?.length > 0;

  return (
    <div className="page-container">
      <PageHeader
        title={`مرحباً ${(user.first_name || user.name || user.username || "").trim()} 👋`}
        description="تابع مؤشرات الأداء واتخذ قراراتك بسرعة عبر لوحة الدعم التقني."
        meta={headerMeta}
        actions={
          <Button variant="outline" icon={LogOut} onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#3f4a5f]">
          <Activity className="h-4 w-4 text-[#1d72dd]" />
          <span>الوصول السريع</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map(({ title, description, href, icon: Icon }) => (
            <Card
              key={href}
              tone="muted"
              className="cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
              onClick={() => router.push(href)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm text-white/80">{description}</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-white/70" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card
        title="لمحة عن أداء النظام"
        description="تتبع أداء البنية التحتية بشكل لحظي واستجب بسرعة لأي تغيّر مفاجئ."
        icon={Activity}
      >
        {hasPerformanceData ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card tone="outline" padding="p-0">
              <header className="px-6 py-4">
                <h3 className="text-lg font-semibold text-[#0f1f3f]">CPU & RAM</h3>
                <p className="text-sm text-[#6b7a94]">
                  مراقبة استهلاك المعالجات والذاكرة عبر الزمن.
                </p>
              </header>
              <div className="h-72 px-4 pb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                    <XAxis dataKey="time" stroke="#6b7a94" />
                    <YAxis stroke="#6b7a94" />
                    <Tooltip />
                    <Line type="monotone" dataKey="CPU" stroke="#1d72dd" strokeWidth={2} />
                    <Line type="monotone" dataKey="RAM" stroke="#30b980" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card tone="outline" padding="p-0">
              <header className="px-6 py-4">
                <h3 className="text-lg font-semibold text-[#0f1f3f]">Disk & Response</h3>
                <p className="text-sm text-[#6b7a94]">
                  سرعة الاستجابة وسعة التخزين لضمان استمرارية الخدمة.
                </p>
              </header>
              <div className="h-72 px-4 pb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                    <XAxis dataKey="time" stroke="#6b7a94" />
                    <YAxis stroke="#6b7a94" />
                    <Tooltip />
                    <Line type="monotone" dataKey="Disk" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Response" stroke="#ea5455" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#8aa7d6] bg-[#ecf4ff] p-10 text-center">
            <Activity className="mb-4 h-10 w-10 text-[#1d72dd]" />
            <h3 className="text-lg font-semibold text-[#0f1f3f]">
              لا توجد بيانات متاحة حالياً
            </h3>
            <p className="mt-2 max-w-md text-sm text-[#6b7a94]">
              بمجرد توفر بيانات حقيقية سيتم تحديث المخططات تلقائياً. يمكنك إدخال بيانات تجريبية لاختبار التجربة.
            </p>
            <Button className="mt-4" variant="secondary" onClick={() => router.push("/SystemMonitoring")}>
              الذهاب إلى مركز المراقبة
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

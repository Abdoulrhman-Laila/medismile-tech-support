"use client";

import {
  Activity,
  Server,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader, Card as UICard } from "@/components/ui";

export default function SystemMonitoringPage() {
  const [cpu, setCpu] = useState(45);
  const [ram, setRam] = useState(55);
  const [storage, setStorage] = useState(70);
  const [network, setNetwork] = useState("مستقر");
  const [chartData, setChartData] = useState([]);

  // جدول الخدمات
  const [services, setServices] = useState([
    { id: 1, name: "خدمة المصادقة", status: "مفعل" },
    { id: 2, name: "خدمة الدفع", status: "مفعل" },
    { id: 3, name: "خدمة النسخ الاحتياطي", status: "متوقف" },
    { id: 4, name: "خدمة البريد الإلكتروني", status: "مفعل" },
  ]);

  // تحديث القيم كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.floor(Math.random() * 100);
      const newRam = Math.floor(Math.random() * 100);
      const newStorage = Math.floor(Math.random() * 100);

      setCpu(newCpu);
      setRam(newRam);
      setStorage(newStorage);
      setNetwork(newCpu > 85 ? "بطيء" : "مستقر");

      setChartData((prev) => [
        ...prev.slice(-10),
        {
          time: new Date().toLocaleTimeString(),
          cpu: newCpu,
          ram: newRam,
          storage: newStorage,
        },
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const headerMeta = [
    { label: "استهلاك CPU", value: `${cpu}%` },
    { label: "استهلاك RAM", value: `${ram}%` },
    { label: "حالة الشبكة", value: network },
  ];

  const serviceBadge = (status) =>
    status === "مفعل"
      ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(48,185,128,0.12)] text-[#1f8d62]"
      : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(234,84,85,0.16)] text-[#a73536]";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="مراقبة أداء النظام"
        description="متابعة لحظية لحالة الخوادم والخدمات الأساسية لضمان أعلى مستويات الجاهزية."
        meta={headerMeta}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="CPU" value={`${cpu}%`} icon={<Server />} color="blue" />
        <StatCard title="RAM" value={`${ram}%`} icon={<Activity />} color="green" />
        <StatCard title="التخزين" value={`${storage}%`} icon={<HardDrive />} color="purple" />
        <StatCard title="الشبكة" value={network} icon={<Wifi />} color={network === "بطيء" ? "red" : "orange"} />
      </div>

      <UICard
        title="أداء النظام مع الزمن"
        description="يتم تحديث البيانات تلقائياً كل خمس ثوانٍ لعرض أحدث القراءات."
        icon={Activity}
        padding="p-6"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#2563eb" name="CPU" />
              <Line type="monotone" dataKey="ram" stroke="#16a34a" name="RAM" />
              <Line type="monotone" dataKey="storage" stroke="#9333ea" name="التخزين" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </UICard>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <UICard title="التنبيهات" description="عرض فوري لأي تحذيرات أو أخطاء في النظام." icon={AlertTriangle}>
          <div className="space-y-2 text-sm">
            {cpu > 80 && <p className="text-red-600">⚠️ CPU عالي ({cpu}%)</p>}
            {ram > 85 && <p className="text-red-600">⚠️ RAM عالي ({ram}%)</p>}
            {storage > 90 && <p className="text-red-600">⚠️ التخزين ممتلئ ({storage}%)</p>}
            {cpu <= 80 && ram <= 85 && storage <= 90 && (
              <p className="text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> النظام يعمل بشكل طبيعي
              </p>
            )}
          </div>
        </UICard>

        <UICard title="حالة الخدمات" description="تأكد من عمل الخدمات الحرجة بشكل صحيح." icon={Server}>
          <div className="rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                    <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الخدمة</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{index + 1}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">{service.name}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {service.status === "مفعل" ? (
                            <CheckCircle2 className="text-green-600" size={18} />
                          ) : (
                            <XCircle className="text-red-600" size={18} />
                          )}
                          <span className={serviceBadge(service.status)}>{service.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </UICard>
      </div>
    </div>
  );
}

// مكوّن الكروت
const toneStyles = {
  blue: {
    bg: "from-[#e8f0ff] via-[#f3f7ff] to-white",
    text: "text-[#1140a0]",
    accent: "text-[#1d63de]",
    ring: "ring-[#9bbdff]/40",
    iconBg: "bg-[#1140a0]/10 text-[#1140a0]",
  },
  green: {
    bg: "from-[#e7f8f1] via-[#f1fcf7] to-white",
    text: "text-[#136c4a]",
    accent: "text-[#1f8f62]",
    ring: "ring-emerald-200/60",
    iconBg: "bg-emerald-500/10 text-emerald-600",
  },
  purple: {
    bg: "from-[#f1e9ff] via-[#f8f3ff] to-white",
    text: "text-[#5b3ea8]",
    accent: "text-[#6f4ed8]",
    ring: "ring-[#c7b5ff]/50",
    iconBg: "bg-[#6f4ed8]/10 text-[#6f4ed8]",
  },
  orange: {
    bg: "from-[#fff4e5] via-[#fff9f0] to-white",
    text: "text-[#b1581f]",
    accent: "text-[#f38a28]",
    ring: "ring-[#fcd9b3]/60",
    iconBg: "bg-[#f38a28]/10 text-[#f38a28]",
  },
  red: {
    bg: "from-[#ffe8e6] via-[#fff2f1] to-white",
    text: "text-[#c0352a]",
    accent: "text-[#eb4b43]",
    ring: "ring-[#ffb9b2]/60",
    iconBg: "bg-[#eb4b43]/10 text-[#eb4b43]",
  },
};

function StatCard({ title, value, icon, color }) {
  const tone = toneStyles[color] || toneStyles.blue;
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${tone.bg} px-6 py-5 shadow-[0_25px_60px_-45px_rgba(16,58,139,0.75)] ring-1 ${tone.ring} transition duration-200 hover:-translate-y-1 hover:shadow-[0_40px_80px_-60px_rgba(16,58,139,0.65)]`}
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-12 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
      </div>
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className={`text-xs font-medium uppercase tracking-[0.35em] ${tone.text}`}>{title}</p>
          <p className={`mt-3 text-3xl font-extrabold ${tone.accent}`}>{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone.iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}

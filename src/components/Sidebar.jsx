"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  University,
  CreditCard,
  HardDrive,
  Users,
  FileText,
  AlertTriangle,
  RefreshCcw,
  Cpu,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";

const menuItems = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "إدارة الجامعات", href: "/universities", icon: University },
  { name: "إدارة النسخ الاحتياطي", href: "/backup-management", icon: HardDrive },
  { name: "إدارة الحسابات", href: "/accounts", icon: Users },
  { name: "تذاكر الدعم الفني", href: "/support", icon: MessageSquare },
  { name: "سجلات التدقيق", href: "/audit", icon: FileText },
  { name: "إدارة السجلات التقنية", href: "/systemlogs", icon: FileText },
  { name: "الحالات السريرية", href: "/cases", icon: FileText },
  { name: "المواعيد", href: "/appointments", icon: FileText },
  { name: "المحتوى المجتمعي", href: "/community", icon: FileText },
  { name: "المرفقات", href: "/attachments", icon: FileText },
  { name: "المراسلات", href: "/messaging", icon: FileText },
  { name: "إدارة الأعطال التقنية", href: "/TechnicalFault", icon: AlertTriangle },
  { name: "إدارة التحديثات التقنية", href: "/TechnicalUpdates", icon: RefreshCcw },
  { name: "مراقبة أداء النظام", href: "/SystemMonitoring", icon: Cpu },
  { name: "إدارة التقارير", href: "/reports", icon: FileText },
  { name: "الإشعارات", href: "/notifications", icon: FileText },
  { name: "التقييمات", href: "/evaluations", icon: FileText },
  { name: "تشخيصات الذكاء الاصطناعي", href: "/ai-diagnoses", icon: FileText },
  { name: "الملف الشخصي", href: "/profile", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isRtl, setIsRtl] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      setIsRtl(document.documentElement.dir !== "ltr");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* 💻 الوضع على الشاشات الكبيرة */}
      <aside
        className={`hidden lg:flex fixed top-0 h-screen w-64 z-40 flex-col border-l border-[#d6e4ff] bg-white text-[#0f1f3f] shadow-sm ${
          isRtl ? "right-0 border-l-0 border-r" : "left-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#d7e8ff] text-[#1d72dd]">
              <Home className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#6b7a94]">ITSUPPORT</p>
              <p className="text-lg font-semibold text-[#0f1f3f]">لوحة التحكم</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                      isActive
                        ? "bg-[#d7e8ff] text-[#155fba]"
                        : "hover:bg-[#ecf4ff]"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-md border ${
                        isActive
                          ? "border-[#afd2ff] bg-white text-[#1d72dd]"
                          : "border-transparent text-[#6b7a94]"
                      }`}
                    >
                      <item.icon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 📱 الوضع على الشاشات الصغيرة */}
      <div
        className={`lg:hidden fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#d6e4ff] bg-white px-4 py-3 shadow-sm ${
          isRtl ? "flex-row-reverse" : ""
        }`}
      >
        <div className="text-base font-semibold text-[#0f1f3f]">لوحة التحكم</div>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-md border border-[#d6e4ff] p-2 text-[#0f1f3f]"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className={`lg:hidden fixed z-40 mt-[52px] w-full border-b border-[#d6e4ff] bg-white shadow-md ${
            isRtl ? "right-0" : "left-0"
          }`}
        >
          <ul className="flex flex-col divide-y divide-[#d6e4ff]">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm transition ${
                      isActive
                        ? "bg-[#d7e8ff] text-[#155fba]"
                        : "text-[#0f1f3f] hover:bg-[#ecf4ff]"
                    }`}
                  >
                    <item.icon size={18} className="text-[#6b7a94]" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

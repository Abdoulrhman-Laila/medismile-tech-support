"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import PageLoader from "./PageLoader";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { loadAuthFromStorage } from "@/redux/slices/authSlice";

export default function AppLayout({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(true);
  const pathname = usePathname();
  const authLoadedRef = useRef(false);

  // تحميل بيانات المصادقة مرة واحدة فقط عند تحميل التطبيق
  useEffect(() => {
    if (!authLoadedRef.current) {
      authLoadedRef.current = true;
      dispatch(loadAuthFromStorage());
    }
  }, [dispatch]);

  // عند تغيّر المسار (بعد التنقل)
  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsRtl(document.documentElement.dir !== "ltr");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    // ✅ دالة آمنة لتشغيل اللودر عند التنقل بين الصفحات
    const notifyNavigation = () => {
      queueMicrotask(() => setLoading(true));
    };

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    history.pushState = function (...args) {
      origPush.apply(this, args);
      notifyNavigation();
      window.dispatchEvent(new Event("app-navigate"));
    };

    history.replaceState = function (...args) {
      origReplace.apply(this, args);
      notifyNavigation();
      window.dispatchEvent(new Event("app-navigate"));
    };

    const onPopstate = () => notifyNavigation();
    window.addEventListener("popstate", onPopstate);

    const onDocClick = (e) => {
      const link = e.target.closest?.("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      if (
        !href ||
        href.startsWith("#") ||
        target === "_blank" ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      if (href !== pathname) notifyNavigation();
    };

    document.addEventListener("click", onDocClick);

    return () => {
      history.pushState = origPush;
      history.replaceState = origReplace;
      window.removeEventListener("popstate", onPopstate);
      document.removeEventListener("click", onDocClick);
    };
  }, [pathname]);

  const hideSidebar = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* ✅ السيدبار */}
      {!hideSidebar && <Sidebar />}

      {/* ✅ المحتوى */}
      <div
        className={`flex-1 min-h-screen bg-[#ecf4ff] relative transition-[padding] duration-300 ease-in-out ${
          !hideSidebar
            ? isRtl
              ? "pr-0 lg:pr-64"
              : "pl-0 lg:pl-64"
            : ""
        }`}
      >
        {/* ✅ اللودر يغطي كل شيء */}
        {loading && (
          <div className="fixed inset-0 z-[9999]">
            <PageLoader loading={loading} />
          </div>
        )}

        {/* ✅ الانتقالات */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`page-wrapper pb-8 ${hideSidebar ? "pt-8" : "pt-16 lg:pt-8"}`}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

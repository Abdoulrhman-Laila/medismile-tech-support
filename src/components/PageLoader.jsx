"use client";

import { Loader2 } from "lucide-react";

export default function PageLoader({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white/90 p-6 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-[#1d72dd]" />
        <p className="text-sm font-medium text-[#3f4a5f]">جارٍ التحميل...</p>
      </div>
    </div>
  );
}


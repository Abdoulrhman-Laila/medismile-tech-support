"use client";

import { cn } from "@/lib/cn";

export function PageHeader({ title, description, meta, actions, className }) {
  return (
    <div
      className={cn(
        "mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 rounded-2xl bg-gradient-to-r from-[#4d9dff]/18 via-[#d7e8ff]/35 to-white p-4 sm:p-6 shadow-sm backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f3f] break-words">{title}</h1>
          {description && (
            <p className="mt-1 sm:mt-2 max-w-2xl text-sm sm:text-base text-[#6b7a94] break-words">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {meta && (
        <dl className="grid gap-3 sm:gap-4 text-sm text-[#6b7a94] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map(({ label, value }, index) => (
            <div key={index} className="rounded-xl border border-[#d6e4ff] bg-[#ecf4ff] px-3 py-2.5 sm:px-4 sm:py-3">
              <dt className="text-xs uppercase tracking-wide text-[#6b7a94]">
                {label}
              </dt>
              <dd className="mt-1 text-sm sm:text-base text-[#0f1f3f] font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}


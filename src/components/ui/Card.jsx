"use client";

import { cn } from "@/lib/cn";

const toneMap = {
  default: "bg-gradient-to-br from-white/95 to-[#ebf4ff]/90 border border-[#d6e4ff]/70 rounded-2xl shadow-[0_6px_18px_rgba(39,86,133,0.08)]",
  muted: "bg-gradient-to-br from-[#4d9dff] to-[#155fba] text-white rounded-2xl shadow-[0_14px_32px_rgba(28,72,122,0.14)]",
  outline: "bg-white border border-dashed border-[#8aa7d6] rounded-2xl",
};

export function Card({
  title,
  description,
  icon: Icon,
  tone = "default",
  header,
  footer,
  actions,
  className,
  children,
  padding = "p-4 sm:p-6",
  ...props
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        padding,
        toneMap[tone] || toneMap.default,
        className
      )}
      {...props}
    >
      {(title || description || Icon || actions || header) && (
        <header className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#d7e8ff] text-[#155fba] shrink-0">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </span>
            )}

            <div className="min-w-0 flex-1">
              {title && (
                <h2 className="text-lg sm:text-xl font-semibold text-[#0f1f3f]">{title}</h2>
              )}
              {description && <p className="text-xs sm:text-sm text-[#6b7a94] mt-1">{description}</p>}
              {header}
            </div>
          </div>

          {actions && <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">{actions}</div>}
        </header>
      )}

      <div className="flex flex-col gap-4">{children}</div>

      {footer && <footer className="mt-4 sm:mt-6 border-t border-[#d6e4ff] pt-4">{footer}</footer>}
    </section>
  );
}


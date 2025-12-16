"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const variantClasses = {
  primary:
    "bg-[#1d72dd] text-white hover:bg-[#155fba] shadow-sm focus-visible:ring-[#4d9dff]",
  secondary:
    "bg-[#d7e8ff] text-[#155fba] hover:bg-[#afd2ff] border border-[#d6e4ff]",
  outline:
    "border border-[#8aa7d6] text-[#0f1f3f] hover:bg-[#d8e8ff]",
  ghost: "text-[#6b7a94] hover:bg-[#d8e8ff]",
  danger:
    "bg-[#ea5455] text-white hover:bg-[#b91c1c] shadow-sm focus-visible:ring-[#fca5a5]",
};

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
  xl: "h-14 px-8 text-lg",
};

export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "start",
    isLoading,
    disabled,
    className,
    children,
    fullWidth,
    ...props
  },
  ref
) {
  const Icon = icon;
  const isDisabled = disabled || isLoading;

  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ecf4ff] disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        {
          "w-full": fullWidth,
        },
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon &&
        iconPosition === "start" && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}

      <span className="truncate">{children}</span>

      {!isLoading && Icon && iconPosition === "end" && (
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
    </Component>
  );
});




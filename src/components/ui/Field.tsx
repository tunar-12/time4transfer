"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  icon?: ReactNode;
  hint?: ReactNode;
  className?: string;
};

export const Field = forwardRef<
  HTMLInputElement,
  FieldProps & InputHTMLAttributes<HTMLInputElement>
>(({ label, icon, hint, className, ...props }, ref) => {
  return (
    <label
      className={cn(
        "group relative flex min-w-0 flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 transition-all duration-200 hover:border-gold/40 focus-within:border-gold/60 focus-within:bg-white/[0.06]",
        className
      )}
    >
      <span className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-bone/55">
        {icon ? <span className="text-gold-soft/80">{icon}</span> : null}
        {label}
      </span>
      <input
        ref={ref}
        {...props}
        style={{ colorScheme: "dark" }}
        className="w-full min-w-0 bg-transparent text-[15px] text-bone placeholder:text-bone/30 focus:outline-none"
      />
      {hint ? (
        <span className="text-xs text-bone/45">{hint}</span>
      ) : null}
    </label>
  );
});
Field.displayName = "Field";

export function FieldSelect({
  label,
  icon,
  className,
  children,
  ...props
}: FieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label
      className={cn(
        "group relative flex min-w-0 flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 transition-all duration-200 hover:border-gold/40 focus-within:border-gold/60 focus-within:bg-white/[0.06]",
        className
      )}
    >
      <span className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-bone/55">
        {icon ? <span className="text-gold-soft/80">{icon}</span> : null}
        {label}
      </span>
      <select
        {...props}
        style={{ colorScheme: "dark" }}
        className="w-full min-w-0 bg-transparent text-[15px] text-bone placeholder:text-bone/30 focus:outline-none appearance-none cursor-pointer pr-6 [&>option]:bg-charcoal [&>option]:text-bone"
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-4 top-1/2 -mt-1 h-2 w-3 text-bone/40"
      >
        <path
          d="M1 1.5L6 6.5L11 1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </label>
  );
}

import { forwardRef } from "react";

export const Input = forwardRef(function Input({ label, error, icon: Icon, className = "", ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-[13px] font-bold text-slate-700">{label}</span>}
      <span className="relative block">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input ref={ref} className={`min-h-12 w-full rounded-xl border bg-white px-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9f0100] focus:ring-4 focus:ring-[#fff7e8] ${Icon ? "pl-10" : ""} ${error ? "border-rose-400" : "border-slate-200"} ${className}`} {...props} />
      </span>
      {error && <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
});
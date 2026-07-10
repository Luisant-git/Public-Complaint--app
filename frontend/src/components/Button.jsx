export function Button({ children, className = "", variant = "primary", type = "button", ...props }) {
  const variants = {
    primary: "bg-government-600 text-white shadow-[0_10px_20px_rgba(9,106,53,0.19)] active:bg-government-700",
    secondary: "bg-government-50 text-government-700 ring-1 ring-government-100 active:bg-government-100",
    outline: "bg-white text-government-700 ring-1 ring-government-200 active:bg-government-50",
    plain: "text-slate-600 active:bg-slate-100",
  };
  return <button type={type} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} {...props}>{children}</button>;
}
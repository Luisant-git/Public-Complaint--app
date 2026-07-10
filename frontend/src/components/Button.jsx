export function Button({ children, className = "", variant = "primary", type = "button", ...props }) {
  const variants = {
    primary: "bg-[#9f0100] text-white shadow-[0_10px_20px_rgba(159,1,0,0.22)] active:bg-[#7a0000]",
    secondary: "bg-[#fec901] text-[#7a0000] ring-1 ring-[#fec901] active:bg-[#f2c000]",
    outline: "bg-white text-[#9f0100] ring-1 ring-[#f3c64f] active:bg-[#fff7e8]",
    plain: "text-slate-600 active:bg-slate-100",
  };
  return <button type={type} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} {...props}>{children}</button>;
}
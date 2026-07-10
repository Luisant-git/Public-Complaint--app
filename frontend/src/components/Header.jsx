import { ArrowLeft, Bell, Megaphone, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header({ title, back = false, action = "notification" }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between bg-government-600 px-4 text-white shadow-[0_2px_11px_rgba(6,69,34,0.18)]">
      <div className="flex min-w-0 items-center gap-3">
        {back ? <button onClick={() => navigate(-1)} aria-label="பின்செல்" className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></button> : <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30"><Megaphone className="h-5 w-5" strokeWidth={2.5} /></div>}
        <div className="min-w-0"><p className="truncate text-[15px] font-extrabold tracking-tight">{title}</p>{!back && <p className="mt-0.5 text-[10px] font-medium text-white/70">மக்கள் குறை தீர்க்கும் தளம்</p>}</div>
      </div>
      {action === "notification" ? <button onClick={() => navigate("/notifications")} aria-label="அறிவிப்புகள்" className="relative grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#fec901] ring-2 ring-[#9f0100]" /></button> : action === "menu" ? <Menu className="h-5 w-5" /> : <span className="w-9" />}
    </header>
  );
}
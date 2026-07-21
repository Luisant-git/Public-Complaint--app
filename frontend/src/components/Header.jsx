import { ArrowLeft, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header({ title, back = false, action = "notification" }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 relative flex h-[68px] items-center justify-center bg-government-600 px-4 text-white shadow-[0_2px_11px_rgba(6,69,34,0.18)]">
      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {back && (
          <button onClick={() => navigate(-1)} aria-label="பின்செல்" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-3 border-white bg-white shadow-sm">
          <img src="/assests/arun.png" alt="TVK logo" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-6 text-center max-w-[calc(100%-12rem)]">
        <p className="truncate text-[15px] font-extrabold tracking-tight min-w-0">{title}</p>
        {!back && <p className="mt-0.5 text-[10px] font-medium text-white/70 whitespace-nowrap">மக்கள் குறை தீர்க்கும் தளம்</p>}
      </div>

      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-3 border-white bg-white shadow-sm">
          <img src="/assests/4.jpeg" alt="header accent" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  );
}
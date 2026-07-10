import { Landmark, Megaphone } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const destination = localStorage.getItem("complaint_token") ? "/dashboard" : "/login";
    const timeout = window.setTimeout(() => navigate(destination, { replace: true }), 10000);
    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="app-canvas">
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center text-white bg-government-700">
        <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-black/15 md:h-48 md:w-48" />
        <div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-lime-300/20" />
        <div className="relative float-gently max-w-[420px] px-4">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-white text-government-700 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"><Megaphone className="h-10 w-10" strokeWidth={2.3} /></div>
          <div className="mt-7">
            <div className="flex items-center justify-center gap-2 text-sm font-extrabold text-white">
              <Landmark className="h-4 w-4" />தமிழ்நாடு அரசு
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white drop-shadow-[0_16px_20px_rgba(0,0,0,0.28)]">குறை தீர்க்கும்<br />பயண்பாடு</h1>
            <p className="mt-3 text-base font-semibold leading-7 text-white/95">மக்கள் குறைகளை எளிதாக பதிவு செய்யும் தளம்</p>
          </div>
        </div>
        <div className="absolute bottom-10 flex items-center gap-2 text-xs font-bold text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-lime-200" />ஏற்றப்படுகிறது...</div>
      </main>
    </div>
  );
}
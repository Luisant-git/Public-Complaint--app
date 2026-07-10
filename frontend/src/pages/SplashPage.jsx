import { Landmark, Megaphone } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = window.setTimeout(() => navigate("/login", { replace: true }), 2000);
    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-government-600 px-8 text-center text-white" style={{ minHeight: "100dvh" }}>
      <div className="absolute -left-16 top-12 h-48 w-48 rounded-full bg-white/5" />
      <div className="absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-lime-300/10" />
      <div className="relative float-gently">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-white text-government-600 shadow-[0_18px_40px_rgba(0,0,0,0.18)]"><Megaphone className="h-10 w-10" strokeWidth={2.3} /></div>
        <div className="mt-7"><div className="flex items-center justify-center gap-2 text-xs font-bold text-white/75"><Landmark className="h-4 w-4" />தமிழ்நாடு அரசு</div><h1 className="mt-3 text-2xl font-extrabold leading-relaxed">குறை தீர்க்கும்<br />பயணபாடு</h1><p className="mt-3 text-xs leading-6 text-white/75">மக்கள் குறைகளை எளிதாக பதிவு செய்யும் தளம்</p></div>
      </div>
      <div className="absolute bottom-12 flex items-center gap-2 text-xs font-bold text-white/75"><span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />ஏற்றப்படுகிறது...</div>
    </main>
  );
}
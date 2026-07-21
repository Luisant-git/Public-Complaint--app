import { Landmark } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const topLeftImg = "/assests/arun.png";
const topRightImg = "/assests/anand.jfif";
const bottomImg = "/assests/4.jpeg";
const topImg = "/assests/tvk.jfif";
const grpImg = "/assests/grppic.png";


  export function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const destination = localStorage.getItem("complaint_token") ? "/dashboard" : "/login";
    const timeout = window.setTimeout(() => navigate(destination, { replace: true }), 10000);
    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="app-canvas">
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden py-10 px-4 text-center text-white bg-government-700">
        <div className="absolute -left-10 top-12 h-40 w-40 rounded-full bg-black/15 md:-left-16 md:h-48 md:w-48" />
        <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-[#fec901]/20 md:-right-16 md:h-56 md:w-56" />
        <div className="relative float-gently w-full max-w-full px-4 md:max-w-[420px]">
          <div className="flex flex-col items-center gap-6">
            <img src={grpImg} alt="Group" className="mx-auto h-48 w-64 object-contain drop-shadow-2xl" />
            <div className="flex items-center justify-center gap-4">
              <img src={topImg} alt="Splash illustration" className="h-44 w-56 rounded-2xl object-cover shadow-xl" />
              <div className="w-20 h-20 bg-white/90 rounded-full shadow-lg overflow-hidden border-2 border-white/50">
                <img src={topRightImg} alt="Top right" className="object-contain w-full h-full" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-44 h-44 bg-white/90 rounded-full shadow-lg overflow-hidden border-2 border-white/50">
                <img src={topLeftImg} alt="Top left" className="object-contain w-full h-full scale-125" />
              </div>
            </div>
            <div className="flex items-center justify-center w-20 h-20 bg-white/90 rounded-full shadow-md p-1 overflow-hidden border border-white/30">
              <img src={bottomImg} alt="Bottom" className="object-contain w-full h-full rounded-full" />
            </div>
          </div>
          <div className="mt-7">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/80 tracking-widest uppercase">
                தி.கோடு வடக்கு ஒன்றியம்
              </div>
              <div className="text-xs font-semibold text-white/90">ப. சக்திவேல்</div>
            </div>
            <h1 className="mt-3 text-lg font-bold leading-snug text-white drop-shadow-[0_8px_12px_rgba(0,0,0,0.2)]">குறை தீர்க்கும்<br />பயண்பாடு</h1>
            <p className="mt-2.5 text-xs font-normal leading-relaxed text-white/75">மக்கள் குறைகளை எளிதாக பதிவு செய்யும் தளம்</p>
          </div>
          <div className="mt-7 flex items-center justify-center gap-2 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#fec901]" />
            ஏற்றப்படுகிறது...
          </div>
        </div>
      </main>
    </div>
  );
}

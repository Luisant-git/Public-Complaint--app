import { Bell, ClipboardPlus, Download, MapPinned, Phone, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "../components/Header";
import { useComplaint } from "../context/ComplaintContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { isOnline, userProfile } = useComplaint();
  const [installPrompt, setInstallPrompt] = useState(null);
  const storedName = localStorage.getItem("user_name")?.trim();
  const storedMobile = localStorage.getItem("user_mobile")?.trim();
  const userName = userProfile?.name?.trim() || storedName || "பயனர்";
  const userMobile = userProfile?.mobile?.trim() || storedMobile || "—";
  useEffect(() => {
    const capturePrompt = (event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
  }, []);
  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  const actions = [
    { label: "புதிய குறை பதிவு", hint: "குறையை பதிவு செய்யவும்", Icon: ClipboardPlus, style: "bg-government-600 text-white", onClick: () => navigate("/complaint-types") },
    { label: "குறை நிலை", hint: "பதிவின் நிலையை அறியவும்", Icon: MapPinned, style: "bg-amber-500 text-white", onClick: () => navigate("/status") },
    { label: "அறிவிப்புகள்", hint: "புதிய தகவல்களைப் பார்க்கவும்", Icon: Bell, style: "bg-violet-600 text-white", onClick: () => navigate("/notifications") },
  ];

  return <main className="min-h-dvh pb-24"><Header title="குறை தீர்க்கும் பயண்பாடு" /><div className="page-enter px-4 pb-5 pt-6"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-500">வணக்கம், {userName}</p><h1 className="mt-1 text-xl font-extrabold text-slate-800">உங்கள் குறையை பதிவு செய்யுங்கள்</h1></div>{!isOnline && <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700"><WifiOff className="h-3.5 w-3.5" />இணையமில்லை</span>}</div><p className="mt-2 max-w-[310px] text-xs leading-5 text-slate-500">சரியான சேவை வகையை தேர்ந்தெடுத்து உங்கள் குறையை எளிதாக தெரிவிக்கலாம்.</p>
    <div className="mt-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-[#fff7e8] to-white px-4 py-3 shadow-[0_8px_18px_rgba(30,53,41,0.04)]"><div className="flex items-start gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#9f0100] text-white shadow-sm"><Phone className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">பயனர் விவரம்</p><p className="mt-1 text-sm font-extrabold text-slate-800">{userName}</p><p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">{userMobile}</p></div></div></div>
    <div className="mt-7 grid gap-3">{actions.map(({ label, hint, Icon, style, onClick }) => <button key={label} onClick={onClick} className={`flex min-h-[86px] items-center gap-4 rounded-2xl px-4 text-left shadow-[0_8px_18px_rgba(30,53,41,0.08)] transition active:scale-[0.985] ${style}`}><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/18"><Icon className="h-6 w-6" /></span><span><span className="block text-[15px] font-extrabold">{label}</span><span className="mt-1 block text-[11px] font-semibold text-white/75">{hint}</span></span></button>)}</div>
    {installPrompt && <button onClick={installApp} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-government-100 bg-government-50 py-3 text-xs font-extrabold text-government-700"><Download className="h-4 w-4" />செயலியை நிறுவுக</button>}
    <button className="mt-5 text-xs font-bold text-government-600" onClick={() => toast.info("உங்கள் தகவல்கள் பாதுகாப்பாக கையாளப்படுகின்றன.")}>உதவி தேவைப்படுகிறதா?</button>
  </div></main>;
}
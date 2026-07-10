import { Building2, ChevronRight, LogOut, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Modal } from "../components/Modal";
import { useComplaint } from "../context/ComplaintContext";

export function ProfilePage() {
  const navigate = useNavigate();
  const { userProfile, clearUserProfile } = useComplaint();
  const [showLogout, setShowLogout] = useState(false);
  const storedName = localStorage.getItem("user_name")?.trim();
  const storedMobile = localStorage.getItem("user_mobile")?.trim();
  const userName = userProfile?.name?.trim() || storedName || "கண்ணன்";
  const userMobile = userProfile?.mobile?.trim() || storedMobile || "—";
  const userInitial = (userName || "U").charAt(0);

  const logout = () => {
    localStorage.removeItem("complaint_token");
    clearUserProfile();
    setShowLogout(false);
    navigate("/login", { replace: true });
  };
  const details = [{ label: "பெயர்", value: userName, Icon: UserRound }, { label: "கைபேசி எண்", value: userMobile, Icon: Phone }, { label: "துறை", value: "ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை", Icon: Building2 }];
  return <main className="min-h-dvh bg-white pb-24"><Header title="சுயவிவரம்" action="none" /><div className="page-enter px-4 py-7"><div className="flex flex-col items-center border-b border-slate-100 pb-7"><div className="grid h-20 w-20 place-items-center rounded-full bg-government-600 text-2xl font-extrabold text-white shadow-[0_10px_22px_rgba(8,97,48,0.18)]">{userInitial}</div><h1 className="mt-3 text-lg font-extrabold text-slate-800">{userName}</h1><p className="mt-1 text-xs text-slate-500">பயனர் சுயவிவரம்</p></div><div className="mt-4">{details.map(({ label, value, Icon }) => <div key={label} className="flex items-center gap-3 border-b border-slate-100 py-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-government-50 text-government-600"><Icon className="h-4 w-4" /></span><div className="flex-1"><p className="text-[10px] font-bold text-slate-400">{label}</p><p className="mt-1 text-[12px] font-extrabold text-slate-700">{value}</p></div><ChevronRight className="h-4 w-4 text-slate-300" /></div>)}</div><Button variant="outline" className="mt-8 w-full border-rose-100 text-rose-600 hover:bg-rose-50" onClick={() => setShowLogout(true)}><LogOut className="h-4 w-4" />வெளியேறு</Button></div><Modal open={showLogout} onClose={() => setShowLogout(false)} title="வெளியேற வேண்டுமா?"><p className="text-xs leading-5 text-slate-500">மீண்டும் பயன்படுத்த உள்நுழைய வேண்டும்.</p><div className="mt-5 grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => setShowLogout(false)}>ரத்து செய்க</Button><Button onClick={logout}>வெளியேறு</Button></div></Modal></main>;
}
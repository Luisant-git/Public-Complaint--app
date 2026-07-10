import { ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { Timeline } from "../components/Timeline";
import { useComplaint } from "../context/ComplaintContext";
import { complaintTimeline } from "../data/complaints";

export function StatusPage() {
  const navigate = useNavigate();
  const { currentComplaint } = useComplaint();
  if (!currentComplaint) return <main className="min-h-dvh bg-white pb-24"><Header title="குறை நிலை" action="none" /><EmptyState icon={ClipboardCheck} title="பதிவு செய்யப்பட்ட குறை இல்லை" detail="முதலில் உங்கள் குறையை பதிவு செய்த பிறகு அதன் நிலையை இங்கே அறியலாம்." /><div className="px-5"><Button className="w-full" onClick={() => navigate("/complaint-types")}>புதிய குறை பதிவு</Button></div></main>;

  return <main className="min-h-dvh bg-white pb-24"><Header title="குறை நிலை" action="none" /><div className="page-enter px-4 py-6"><div className="rounded-2xl bg-government-600 px-4 py-4 text-white shadow-[0_10px_24px_rgba(8,97,48,0.16)]"><p className="text-[11px] font-bold text-white/70">குறை எண்</p><p className="font-number mt-1 text-[16px] font-extrabold tracking-wide">{currentComplaint.number}</p><div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3"><span className="text-[11px] font-bold">{currentComplaint.type}</span><span className="rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-extrabold text-amber-900">{currentComplaint.status}</span></div></div>
    <div className="mt-6"><h1 className="text-base font-extrabold text-slate-800">குறை முன்னேற்றம்</h1><p className="mt-1 text-xs text-slate-500">உங்கள் குறை தற்போது பரிசீலனையில் உள்ளது.</p><div className="mt-6"><Timeline items={complaintTimeline} /></div></div>
    </div></main>;
}
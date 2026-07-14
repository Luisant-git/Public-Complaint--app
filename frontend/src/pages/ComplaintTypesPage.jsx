import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { complaintTypes } from "../data/complaints";

export function ComplaintTypesPage() {
  const navigate = useNavigate();
  return <main className="min-h-dvh bg-white"><Header title="குறை வகை தேர்வு" back action="none" /><div className="page-enter px-4 pb-8 pt-6"><h1 className="text-lg font-extrabold text-slate-800">உங்கள் குறை எந்த வகையைச் சார்ந்தது?</h1><p className="mt-2 text-xs leading-5 text-slate-500">சரியான வகையை தேர்ந்தெடுத்தால் குறையை விரைவாக பரிசீலிக்க உதவும்.</p><div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_6px_22px_rgba(27,58,41,0.07)]">{complaintTypes.map(({ id, name, Icon, iconColor, soft }, index) => <button key={id} onClick={() => navigate(`/complaint/${id}`)} className={`flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition active:bg-slate-50 ${index !== complaintTypes.length - 1 ? "border-b border-slate-100" : ""}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${soft} ${iconColor}`}><Icon className="h-5 w-5" /></span><span className="flex-1 text-[13px] font-extrabold text-slate-700">{name}</span><ChevronRight className="h-4 w-4 text-slate-300" /></button>)}</div></div></main>;
}
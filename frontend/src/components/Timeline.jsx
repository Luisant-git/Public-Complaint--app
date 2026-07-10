import { Check } from "lucide-react";

export function Timeline({ items }) {
  return <ol className="space-y-0">{items.map((item, index) => {
    const isDone = item.state === "done";
    const isCurrent = item.state === "current";
    return <li key={item.title} className="relative flex gap-3.5 pb-6 last:pb-0">{index !== items.length - 1 && <span className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-px ${isDone ? "bg-government-500" : "bg-slate-200"}`} />}<span className={`z-10 grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full ${isDone ? "bg-government-600 text-white" : isCurrent ? "border-[5px] border-government-100 bg-government-600" : "border-2 border-slate-200 bg-white"}`}>{isDone && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span><div className="-mt-0.5"><p className={`text-[13px] font-extrabold ${item.state === "upcoming" ? "text-slate-400" : "text-slate-800"}`}>{item.title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{item.detail}</p></div></li>;
  })}</ol>;
}
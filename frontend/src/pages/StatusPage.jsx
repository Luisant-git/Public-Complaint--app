import { ClipboardCheck, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { useComplaint } from "../context/ComplaintContext";
import { complaintsApi } from "../api/complaints";

const STATUS_COLOR = {
  "பரிசீலனையில் உள்ளது": "bg-amber-100 text-amber-800",
  "நடவடிக்கை எடுக்கப்பட்டது": "bg-blue-100 text-blue-800",
  "தீர்க்கப்பட்டது": "bg-green-100 text-green-800",
};

export function StatusPage() {
  const navigate = useNavigate();
  const { currentComplaint } = useComplaint();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await complaintsApi.myComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <main className="min-h-dvh bg-white pb-24">
        <Header title="குறை நிலை" action="none" />
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-government-600" />
        </div>
      </main>
    );
  }

  if (!loading && complaints.length === 0) {
    return (
      <main className="min-h-dvh bg-white pb-24">
        <Header title="குறை நிலை" action="none" />
        <EmptyState
          icon={ClipboardCheck}
          title="பதிவு செய்யப்பட்ட குறை இல்லை"
          detail="முதலில் உங்கள் குறையை பதிவு செய்த பிறகு அதன் நிலையை இங்கே அறியலாம்."
        />
        <div className="px-5">
          <Button className="w-full" onClick={() => navigate("/complaint-types")}>
            புதிய குறை பதிவு
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-white pb-24">
      <Header title="குறை நிலை" action="none" />
      <div className="page-enter px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-extrabold text-slate-800">என் குறைகள்</h1>
          <button
            onClick={load}
            className="flex items-center gap-1 text-xs text-government-600 font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" /> புதுப்பி
          </button>
        </div>

        {complaints.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
          >
            {/* Number + Status */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  குறை எண்
                </p>
                <p className="mt-0.5 font-mono text-[15px] font-extrabold text-government-700">
                  {c.number}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                  STATUS_COLOR[c.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {c.status}
              </span>
            </div>

            {/* Type */}
            <div className="mt-3 border-t border-gray-50 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                வகை
              </p>
              <p className="mt-0.5 text-[13px] font-semibold text-slate-700">{c.type}</p>
            </div>

            {/* Location */}
            {c.location && (
              <div className="mt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  இடம்
                </p>
                <p className="mt-0.5 text-[13px] text-slate-600">{c.location}</p>
              </div>
            )}

            {/* Remarks from admin */}
            {c.remarks && (
              <div className="mt-2 rounded-xl bg-blue-50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                  நிர்வாக கருத்து
                </p>
                <p className="mt-0.5 text-[12px] text-blue-800">{c.remarks}</p>
              </div>
            )}

            {/* Date */}
            <p className="mt-3 text-[11px] text-gray-400">
              {new Date(c.createdAt).toLocaleDateString("ta-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
import { ClipboardCheck, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { useComplaint } from "../context/ComplaintContext";
import { complaintsApi } from "../api/complaints";

const STATUS_CONFIG = {
  "பரிசீலனையில் உள்ளது": {
    label: "பரிசீலனையில்",
    color: "bg-amber-500",
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  "நடவடிக்கை எடுக்கப்பட்டது": {
    label: "நடவடிக்கை எடுக்கப்பட்டது",
    color: "bg-blue-500",
    ring: "ring-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  "தீர்க்கப்பட்டது": {
    label: "தீர்க்கப்பட்டது",
    color: "bg-emerald-500",
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

function TimelineStep({ active, completed, label, date, isLast }) {
  return (
    <div className="flex gap-3">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 z-10 transition-all duration-500 ${
            completed
              ? "bg-white border-emerald-500 shadow-sm shadow-emerald-200"
              : active
              ? "bg-white border-amber-500 shadow-sm shadow-amber-200"
              : "bg-white border-gray-300"
          }`}
        >
          {completed && (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-emerald-500 mx-auto mt-[1px]">
              <path fill="currentColor" d="M6.173 10.984L3.34 8.151l-.827.827 3.66 3.66 7.32-7.32-.827-.827z" />
            </svg>
          )}
          {active && !completed && (
            <div className="w-2 h-2 bg-amber-500 rounded-full mx-auto mt-[2px] animate-pulse" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[2rem] ${
              completed ? "bg-emerald-300" : "bg-gray-200"
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
        <p className={`text-sm font-bold ${completed ? "text-emerald-700" : active ? "text-amber-700" : "text-gray-400"}`}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            {new Date(date).toLocaleDateString("ta-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function ComplaintCard({ complaint }) {
  const cfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG["பரிசீலனையில் உள்ளது"];

  const steps = [
    {
      label: "குறை பதிவு செய்யப்பட்டது",
      date: complaint.createdAt,
      completed: true,
      active: false,
    },
    {
      label: "நடவடிக்கை எடுக்கப்பட்டது",
      date: complaint.actionTakenAt || null,
      completed: !!complaint.actionTakenAt,
      active: !complaint.actionTakenAt && complaint.status !== "தீர்க்கப்பட்டது",
    },
    {
      label: "குறை தீர்க்கப்பட்டது",
      date: complaint.resolvedAt || null,
      completed: !!complaint.resolvedAt,
      active: !complaint.resolvedAt && complaint.status === "நடவடிக்கை எடுக்கப்பட்டது",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              குறை எண்
            </p>
            <p className="mt-0.5 font-mono text-[15px] font-extrabold text-government-700">
              {complaint.number}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">வகை</p>
            <p className="text-[13px] font-semibold text-slate-700 mt-0.5">{complaint.type}</p>
          </div>
          {complaint.location && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">இடம்</p>
              <p className="text-[13px] text-slate-600 mt-0.5 truncate">{complaint.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-50">
        {steps.map((step, i) => (
          <TimelineStep
            key={step.label}
            label={step.label}
            date={step.date}
            completed={step.completed}
            active={step.active}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>

      {/* Remarks */}
      {complaint.remarks && (
        <div className="px-4 pb-4">
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-3.5 py-2.5 border border-blue-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
              நிர்வாக கருத்து
            </p>
            <p className="mt-0.5 text-[12px] text-blue-800 font-medium">{complaint.remarks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusPage() {
  const navigate = useNavigate();
  const { currentComplaint } = useComplaint();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
const PAGE_SIZE = 10;
const [searchNumber, setSearchNumber] = useState("");
const [searchType, setSearchType] = useState("");
const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    load();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchNumber, searchType]);

  if (loading) {
    return (
      <main className="min-h-dvh bg-gray-50 pb-24">
        <Header title="குறை நிலை" action="none" />
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-government-600" />
        </div>
      </main>
    );
  }

  if (!loading && complaints.length === 0) {
    return (
      <main className="min-h-dvh bg-gray-50 pb-24">
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
  // Search and pagination logic
  const complaintTypes = Array.from(new Set(complaints.map(c => c.type))).sort();
  const filtered = complaints.filter(c => {
    const matchesNumber = searchNumber === "" || c.number.includes(searchNumber);
    const matchesType = searchType === "" || c.type === searchType;
    return matchesNumber && matchesType;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > pageCount) page = pageCount;
    setCurrentPage(page);
  };

  return (
    <main className="min-h-dvh bg-gray-50 pb-24">
      <Header title="குறை நிலை" action="none" />
      <div className="page-enter px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">என் குறைகள்</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {filtered.length} {filtered.length === 1 ? "குறை" : "குறைகள்"}
            </p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-xl bg-white border border-gray-200 px-3.5 py-2 text-xs font-bold text-government-600 shadow-sm hover:bg-gray-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> புதுப்பி
          </button>
        </div>

<div className="flex flex-col sm:flex-row gap-2 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
  <div className="flex-1 min-w-0">
    <input
      type="text"
      placeholder="குறை எண் தேடவும்..."
      value={searchNumber}
      onChange={(e) => setSearchNumber(e.target.value)}
      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-government-500"
    />
  </div>
  <div className="flex-1 min-w-0">
    <select
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-government-500"
    >
      <option value="">அனைத்து வகைகள்</option>
      {complaintTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>
  {(searchNumber || searchType) && (
    <button
      type="button"
      onClick={() => {
        setSearchNumber('');
        setSearchType('');
        setCurrentPage(1);
      }}
      className="flex items-center justify-center w-10 h-10 border rounded text-gray-600 hover:bg-gray-50"
    >
      <X size={16} />
    </button>
  )}
</div>

{/* Pagination */}
        {paginated.map((c) => (
          <ComplaintCard key={c.id} complaint={c} />
        ))}

        <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="flex items-center justify-center w-9 h-9 disabled:opacity-50 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors duration-200 rounded-full"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <button
              disabled={currentPage === pageCount}
              onClick={() => goToPage(currentPage + 1)}
                className="flex items-center justify-center w-9 h-9 disabled:opacity-50 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors duration-200 rounded-full"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
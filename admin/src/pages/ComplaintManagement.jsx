import { useState, useEffect } from "react";
import { Search, Eye, SquarePen, CheckCircle, Clock, AlertTriangle, MessageSquare, Phone, User, Save, X, ChevronLeft, ChevronRight } from "lucide-react";
import { complaintsApi } from "../api/complaints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  "பரிசீலனையில் உள்ளது": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", icon: Clock, taLabel: "பரிசீலனையில்", shortLabel: "பரிசீலனை" },
  "நடவடிக்கை எடுக்கப்பட்டது": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", icon: AlertTriangle, taLabel: "நடவடிக்கை", shortLabel: "நடவடிக்கை" },
  "தீர்க்கப்பட்டது": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", icon: CheckCircle, taLabel: "தீர்க்கப்பட்டது", shortLabel: "தீர்க்கப்பட்டது" },
};

const STATUS_OPTIONS = ["பரிசீலனையில் உள்ளது", "நடவடிக்கை எடுக்கப்பட்டது", "தீர்க்கப்பட்டது"];
const COMPLAINT_TYPES = [
  "All",
  "குடிநீர் தொடர்பான குறை",
  "மின்சாரம் / தெருவிளக்கு குறை",
  "சாலை குறை",
  "சுகாதார குறை",
  "கட்டிட வசதி குறை",
  "பொது போக்குவரத்து குறை",
  "மற்றவை",
];

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status, short }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES["பரிசீலனையில் உள்ளது"];
  const Icon = style.icon;
  const label = short ? style.shortLabel : style.taLabel;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${style.bg} ${style.text}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#e5e7eb" }}>
      <p className="text-xs text-gray-500">
        பக்கம் {currentPage} / {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all ${page === currentPage
              ? "text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
              }`}
            style={page === currentPage ? { backgroundColor: "#1D6FB9" } : {}}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default function ComplaintManagement() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [editComplaint, setEditComplaint] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintsApi.getComplaints({
        status: statusFilter,
        type: typeFilter,
        search: search,
        fromDate,
        toDate,
      });
      setComplaints(data);
      setCurrentPage(1);
    } catch (err) {
      toast.error("குறைகளை ஏற்றுவதில் பிழை ஏற்பட்டது.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadComplaints();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, typeFilter, statusFilter, fromDate, toDate]);

  const totalPages = Math.ceil(complaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = complaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "பரிசீலனையில் உள்ளது").length,
    action: complaints.filter(c => c.status === "நடவடிக்கை எடுக்கப்பட்டது").length,
    resolved: complaints.filter(c => c.status === "தீர்க்கப்பட்டது").length,
  };

  const openEdit = (complaint) => {
    setEditComplaint(complaint);
    setEditStatus(complaint.status);
    setEditRemarks(complaint.remarks || "");
  };

  const saveEdit = async () => {
    try {
      const assignedToName = user?.name || "Admin Staff";
      await complaintsApi.updateComplaint(editComplaint.id, {
        status: editStatus,
        remarks: editRemarks,
        assignedTo: assignedToName,
      });
      toast.success("மாற்றங்கள் சேமிக்கப்பட்டன.");
      setEditComplaint(null);
      loadComplaints();
    } catch (err) {
      toast.error("மாற்றங்களை சேமிப்பதில் பிழை ஏற்பட்டது.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
    loadComplaints();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1D6FB9" }}>
          <MessageSquare size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "#1a2332" }}>குறை மேலாண்மை</h1>
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString("ta-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: "மொத்த குறைகள்", value: stats.total, color: "#1D6FB9" },
          { icon: Clock, label: "பரிசீலனையில்", value: stats.pending, color: "#d97706" },
          { icon: AlertTriangle, label: "நடவடிக்கை எடுக்கப்பட்டது", value: stats.action, color: "#2563eb" },
          { icon: CheckCircle, label: "தீர்க்கப்பட்டது", value: stats.resolved, color: "#16a34a" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 border shadow-sm" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-extrabold" style={{ color: "#1a2332" }}>{s.value}</div>
            <div className="text-sm text-gray-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters - stack on mobile, equal columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block sm:hidden">தேடுக</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="தேடுக..." className="w-full bg-white border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all h-12" style={{ borderColor: "#e5e7eb" }} onFocus={e => e.target.style.borderColor = "#1D6FB9"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block sm:hidden">வகை</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none h-12" style={{ borderColor: "#e5e7eb" }}>
            {COMPLAINT_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "அனைத்து வகைகள்" : t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block sm:hidden">நிலை</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm outline-none h-12" style={{ borderColor: "#e5e7eb" }}>
            <option value="All">அனைத்து நிலைகள்</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_STYLES[s]?.taLabel || s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block sm:hidden">From</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full bg-white border rounded-xl px-3 py-2 text-sm h-12" style={{ borderColor: "#e5e7eb" }} />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block sm:hidden">To</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full bg-white border rounded-xl px-3 py-2 text-sm h-12" style={{ borderColor: "#e5e7eb" }} />
        </div>
        <div className="flex items-end">
          <button onClick={clearFilters} className="w-full bg-white border rounded-xl px-4 py-2 text-sm h-12 whitespace-nowrap" style={{ borderColor: "#e5e7eb" }}>Clear</button>
        </div>
      </div>

      {/* Table / Responsive list */}
      <div className="rounded-2xl bg-white border shadow-sm overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        {loading && complaints.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop / large: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "#e5e7eb", backgroundColor: "#f8fafc" }}>
                    <th className="text-left px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>குறை எண்</th>
                    <th className="text-left px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>பெயர்</th>
                    <th className="text-left px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>வகை</th>
                    <th className="text-left px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>இடம்</th>
                    <th className="text-left px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>தேதி</th>
                    <th className="text-left px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>நிலை</th>
                    <th className="text-right px-3 py-3 font-semibold text-xs text-slate-600 whitespace-nowrap" style={{ color: "#1D6FB9" }}>செயல்கள்</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                  {paginatedComplaints.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">குறைகள் எதுவும் இல்லை</td></tr>
                  ) : (
                    paginatedComplaints.map((complaint) => {
                      const submitterName = complaint.user?.name || "Anonymous";
                      const submitterMobile = complaint.user?.mobile || "";
                      return (
                        <tr key={complaint.id} className="border-b hover:bg-[#eef4fa]/30 transition-colors" style={{ borderColor: "#e5e7eb" }}>
                          <td className="px-3 py-3 align-top"><span className="font-mono text-sm font-bold whitespace-nowrap" style={{ color: "#1D6FB9" }}>{complaint.number}</span></td>
                          <td className="px-3 py-3 align-top">
                            <div className="max-w-[120px]">
                              <div className="font-medium text-gray-800 text-xs truncate">{submitterName}</div>
                              <div className="text-xs text-gray-400 truncate">{submitterMobile}</div>
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top">
                            <span className="text-gray-700 text-xs whitespace-nowrap">{complaint.type}</span>
                          </td>
                          <td className="px-3 py-3 align-top max-w-[160px]">
                            <span className="text-gray-600 text-xs block truncate" title={complaint.location || "-"}>{complaint.location || "-"}</span>
                          </td>
                          <td className="px-3 py-3 align-top whitespace-nowrap"><span className="text-gray-600 text-xs">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</span></td>
                          <td className="px-3 py-3 align-top whitespace-nowrap"><StatusBadge status={complaint.status} short /></td>
                          <td className="px-3 py-3 text-right align-top whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => setViewComplaint(complaint)} className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ color: "#6b7280", backgroundColor: "#f3f4f6" }}>
                                <Eye size={13} /> பார்க்க
                              </button>
                              <button onClick={() => openEdit(complaint)} className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ color: "#1D6FB9", backgroundColor: "#eef4fa" }}>
                                <SquarePen size={13} />திருத்து
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              {/* Desktop Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {/* Mobile: card list */}
            <div className="block md:hidden">
              <div className="space-y-3 p-3">
                {paginatedComplaints.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">குறைகள் எதுவும் இல்லை</div>
                ) : (
                  paginatedComplaints.map(complaint => (
                    <div key={complaint.id} className="p-4 bg-white border rounded-2xl shadow-sm" style={{ borderColor: "#e5e7eb" }}>
                      {/* Complaint number first */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-mono text-sm font-bold" style={{ color: "#1D6FB9" }}>{complaint.number}</div>
                        <StatusBadge status={complaint.status} short />
                      </div>
                      {/* Name */}
                      <div className="font-semibold text-sm mt-2 truncate" style={{ color: "#1a2332" }}>{complaint.user?.name || 'Anonymous'}</div>
                      {/* Type in one line without wrap */}
                      <div className="text-xs text-gray-600 mt-1 truncate">{complaint.type}</div>
                      {/* Place / Location */}
                      <div className="text-xs text-gray-500 mt-1 truncate"><span className="font-medium text-gray-400">இடம்: </span>{complaint.location || "-"}</div>
                      {/* Date */}
                      <div className="text-xs text-gray-400 mt-1">{new Date(complaint.createdAt).toLocaleDateString('en-IN')}</div>
                      {/* Actions in same line */}
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => setViewComplaint(complaint)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}><Eye size={13} /> பார்க்க</button>
                        <button onClick={() => openEdit(complaint)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: '#eef4fa', color: '#1D6FB9' }}><SquarePen size={13} /> திருத்து</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Mobile Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      {viewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setViewComplaint(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
              <div>
                <h3 className="font-bold text-lg" style={{ color: "#1a2332" }}>குறை விவரங்கள்</h3>
                <p className="text-sm font-bold font-mono" style={{ color: "#1D6FB9" }}>{viewComplaint.number}</p>
              </div>
              <button onClick={() => setViewComplaint(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-semibold" style={{ color: "#1a2332" }}>{viewComplaint.user?.name || "Anonymous"}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-400"><Phone size={12} /> {viewComplaint.user?.mobile}</div>
                </div>
                <div className="ml-auto"><StatusBadge status={viewComplaint.status} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ backgroundColor: "#eef4fa" }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "#1D6FB9" }}>குறை வகை</div>
                  <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{viewComplaint.type}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "#1D6FB9" }}>இடம்</div>
                  <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{viewComplaint.location || "-"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "#1D6FB9" }}>சமர்ப்பித்த தேதி</div>
                  <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{new Date(viewComplaint.createdAt).toLocaleString("en-IN")}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: "#1D6FB9" }}>விளக்கம்</div>
                <p className="text-sm text-gray-700 rounded-xl p-3" style={{ backgroundColor: "#f9fafb" }}>{viewComplaint.description}</p>
                {viewComplaint.images && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(() => {
                      try {
                        const imgs = typeof viewComplaint.images === 'string' ? JSON.parse(viewComplaint.images) : viewComplaint.images;
                        return imgs.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt="complaint"
                            className="w-full h-24 object-cover rounded cursor-pointer"
                            onClick={() => {
                              setGalleryOpen(true);
                              setGalleryIndex(idx);
                            }}
                          />
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                )}
                {galleryOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setGalleryOpen(false)}>
                    <div className="relative w-[min(92vw,900px)] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                      <button
                        className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                        onClick={() => setGalleryOpen(false)}
                        aria-label="Close image preview"
                      >
                        <X size={20} />
                      </button>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
                        onClick={e => {
                          e.stopPropagation();
                          const imageCount = Array.isArray(viewComplaint.images) ? viewComplaint.images.length : JSON.parse(viewComplaint.images).length;
                          setGalleryIndex((galleryIndex - 1 + imageCount) % imageCount);
                        }}
                        aria-label="Previous image"
                      >
                        &#8249;
                      </button>
                      <img
                        src={
                          typeof viewComplaint.images === 'string'
                            ? JSON.parse(viewComplaint.images)[galleryIndex]
                            : viewComplaint.images[galleryIndex]
                        }
                        alt="complaint"
                        className="w-full max-h-[82vh] h-auto object-contain rounded"
                      />
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
                        onClick={e => {
                          e.stopPropagation();
                          const imageCount = Array.isArray(viewComplaint.images) ? viewComplaint.images.length : JSON.parse(viewComplaint.images).length;
                          setGalleryIndex((galleryIndex + 1) % imageCount);
                        }}
                        aria-label="Next image"
                      >
                        &#8250;
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {viewComplaint.assignedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-600"><User size={14} /> ஒதுக்கப்பட்டவர்: <strong>{viewComplaint.assignedTo}</strong></div>
              )}
              {viewComplaint.remarks && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#1D6FB9" }}>குறிப்புகள்</div>
                  <p className="text-sm text-gray-700 rounded-xl p-3" style={{ backgroundColor: "#eef4fa" }}>{viewComplaint.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setEditComplaint(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
              <div>
                <h3 className="font-bold text-lg" style={{ color: "#1a2332" }}>குறையை திருத்து</h3>
                <p className="text-sm font-bold font-mono" style={{ color: "#1D6FB9" }}>{editComplaint.number}</p>
              </div>
              <button onClick={() => setEditComplaint(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-5 space-y-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-semibold" style={{ color: "#1a2332" }}>{editComplaint.user?.name || "Anonymous"}</div>
                  <div className="text-xs text-gray-400">{editComplaint.type} · {editComplaint.user?.mobile}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: "#1D6FB9" }}>இடம்</div>
                <p className="text-sm text-gray-600 rounded-xl p-3" style={{ backgroundColor: "#f9fafb" }}>{editComplaint.location || "-"}</p>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: "#1D6FB9" }}>விளக்கம்</div>
                <p className="text-sm text-gray-600 rounded-xl p-3" style={{ backgroundColor: "#f9fafb" }}>{editComplaint.description}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>நிலை</label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(status => {
                    const active = editStatus === status;
                    return (
                      <button key={status} onClick={() => setEditStatus(status)}
                        className={`flex-1 px-1.5 py-2 rounded-xl text-[10px] font-bold leading-tight transition-all ${active ? "text-white shadow-md" : "hover:bg-gray-100"}`}
                        style={active ? { backgroundColor: status === "பரிசீலனையில் உள்ளது" ? "#d97706" : status === "நடவடிக்கை எடுக்கப்பட்டது" ? "#2563eb" : "#16a34a" } : { backgroundColor: "#f9fafb", color: "#6b7280" }}
                      >
                        {STATUS_STYLES[status]?.shortLabel || status}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>குறிப்புகள்</label>
                <textarea value={editRemarks} onChange={e => setEditRemarks(e.target.value)} placeholder="குறிப்புகளை இங்கே சேர்க்கவும்..." className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all" style={{ borderColor: "#e5e7eb", minHeight: "100px" }} onFocus={e => e.target.style.borderColor = "#1D6FB9"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>

              <button onClick={saveEdit} className="w-full text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] whitespace-nowrap" style={{ backgroundColor: "#1D6FB9", boxShadow: "0 8px 20px rgba(29,111,185,0.25)" }}>
                <Save size={18} className="shrink-0" />
                <span>மாற்றங்களை சேமிக்க</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
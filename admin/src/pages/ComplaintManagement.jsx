import { useState, useEffect } from "react";
import { Search, Eye, Edit3, CheckCircle, Clock, AlertTriangle, MessageSquare, Phone, User, Save, X } from "lucide-react";
import { complaintsApi } from "../api/complaints.js";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  "பரிசீலனையில் உள்ளது": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", icon: Clock, taLabel: "பரிசீலனையில்" },
  "நடவடிக்கை எடுக்கப்பட்டது": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", icon: AlertTriangle, taLabel: "நடவடிக்கை" },
  "தீர்க்கப்பட்டது": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", icon: CheckCircle, taLabel: "தீர்க்கப்பட்டது" },
};

const STATUS_OPTIONS = ["பரிசீலனையில் உள்ளது", "நடவடிக்கை எடுக்கப்பட்டது", "தீர்க்கப்பட்டது"];
const COMPLAINT_TYPES = ["All", "Water Supply", "Road Damage", "Garbage Collection", "Street Light", "Drainage", "Noise Complaint"];

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES["பரிசீலனையில் உள்ளது"];
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      <Icon size={12} />
      {style.taLabel}
    </span>
  );
}

export default function ComplaintManagement() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [editComplaint, setEditComplaint] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintsApi.getComplaints({
        status: statusFilter,
        type: typeFilter,
        search: search,
      });
      setComplaints(data);
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
  }, [search, typeFilter, statusFilter]);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="தேடுக..." className="w-full bg-white border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all" style={{ borderColor: "#e5e7eb" }} onFocus={e => e.target.style.borderColor = "#1D6FB9"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor: "#e5e7eb" }}>
          {COMPLAINT_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "அனைத்து வகைகள்" : t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor: "#e5e7eb" }}>
          <option value="All">அனைத்து நிலைகள்</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_STYLES[s]?.taLabel || s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border shadow-sm overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        {loading && complaints.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#e5e7eb", backgroundColor: "#eef4fa" }}>
                  <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: "#1D6FB9" }}>குறை எண்</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: "#1D6FB9" }}>பெயர்</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: "#1D6FB9" }}>வகை</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: "#1D6FB9" }}>தேதி</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: "#1D6FB9" }}>நிலை</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs" style={{ color: "#1D6FB9" }}>செயல்கள்</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">குறைகள் எதுவும் இல்லை</td></tr>
                ) : (
                  complaints.map((complaint) => {
                    const submitterName = complaint.user?.name || "Anonymous";
                    const submitterMobile = complaint.user?.mobile || "";
                    return (
                      <tr key={complaint.id} className="border-b hover:bg-[#eef4fa]/30 transition-colors" style={{ borderColor: "#e5e7eb" }}>
                        <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-gray-700">{complaint.number}</span></td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-800 text-xs">{submitterName}</div>
                            <div className="text-xs text-gray-400">{submitterMobile}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="text-gray-700 text-xs">{complaint.type}</span></td>
                        <td className="px-4 py-3"><span className="text-gray-600 text-xs">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</span></td>
                        <td className="px-4 py-3"><StatusBadge status={complaint.status} /></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setViewComplaint(complaint)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ color: "#6b7280", backgroundColor: "#f3f4f6" }}>
                              <Eye size={14} /> பார்க்க
                            </button>
                            <button onClick={() => openEdit(complaint)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors" style={{ color: "#1D6FB9", backgroundColor: "#eef4fa" }}>
                              <Edit3 size={14} /> திருத்து
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setViewComplaint(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
              <div>
                <h3 className="font-bold text-lg" style={{ color: "#1a2332" }}>குறை விவரங்கள்</h3>
                <p className="text-xs text-gray-400 font-mono">{viewComplaint.number}</p>
              </div>
              <button onClick={() => setViewComplaint(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: "#1D6FB9" }}>{(viewComplaint.user?.name || "A").charAt(0)}</div>
                <div>
                  <div className="font-semibold" style={{ color: "#1a2332" }}>{viewComplaint.user?.name || "Anonymous"}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-400"><Phone size={12} /> {viewComplaint.user?.mobile}</div>
                </div>
                <div className="ml-auto"><StatusBadge status={viewComplaint.status} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ backgroundColor: "#eef4fa" }}>
                <div>
                  <div className="text-xs text-gray-400 font-medium">குறை வகை</div>
                  <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{viewComplaint.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">சமர்ப்பித்த தேதி</div>
                  <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{new Date(viewComplaint.createdAt).toLocaleString("en-IN")}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium mb-1">விளக்கம்</div>
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
                {/* Gallery Lightbox */}
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
                  <div className="text-xs text-gray-400 font-medium mb-1">குறிப்புகள்</div>
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
                <p className="text-xs text-gray-400 font-mono">{editComplaint.number}</p>
              </div>
              <button onClick={() => setEditComplaint(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: "#1D6FB9" }}>{(editComplaint.user?.name || "A").charAt(0)}</div>
                <div>
                  <div className="font-semibold" style={{ color: "#1a2332" }}>{editComplaint.user?.name || "Anonymous"}</div>
                  <div className="text-xs text-gray-400">{editComplaint.type} · {editComplaint.user?.mobile}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 font-medium mb-1">விளக்கம்</div>
                <p className="text-sm text-gray-600 rounded-xl p-3" style={{ backgroundColor: "#f9fafb" }}>{editComplaint.description}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>நிலை</label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(status => {
                    const active = editStatus === status;
                    return (
                      <button key={status} onClick={() => setEditStatus(status)}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${active ? "text-white shadow-md" : "hover:bg-gray-100"}`}
                        style={active ? { backgroundColor: status === "பரிசீலனையில் உள்ளது" ? "#d97706" : status === "நடவடிக்கை எடுக்கப்பட்டது" ? "#2563eb" : "#16a34a" } : { backgroundColor: "#f9fafb", color: "#6b7280" }}
                      >
                        {STATUS_STYLES[status]?.taLabel || status}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>குறிப்புகள்</label>
                <textarea value={editRemarks} onChange={e => setEditRemarks(e.target.value)} placeholder="குறிப்புகளை இங்கே சேர்க்கவும்..." className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all" style={{ borderColor: "#e5e7eb", minHeight: "100px" }} onFocus={e => e.target.style.borderColor = "#1D6FB9"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>

              <button onClick={saveEdit} className="w-full text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98]" style={{ backgroundColor: "#1D6FB9", boxShadow: "0 8px 20px rgba(29,111,185,0.25)" }}>
                <Save size={18} />
                மாற்றங்களை சேமிக்க
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
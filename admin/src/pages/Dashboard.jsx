import { useMemo } from "react";
import { Clock, AlertTriangle, CheckCircle, MessageSquare, TrendingUp, Users, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_COMPLAINTS = [
  { id: 1, number: "CMP20260100", name: "Ramesh Kumar", mobile: "9876543210", type: "Water Supply", location: "Sector 12, Noida", submittedAt: "2026-07-11T09:30:00", status: "பரிசீலனையில் உள்ளது" },
  { id: 2, number: "CMP20260101", name: "Sita Devi", mobile: "9876543211", type: "Road Damage", location: "Block C, Dwarka", submittedAt: "2026-07-11T10:15:00", status: "பரிசீலனையில் உள்ளது" },
  { id: 3, number: "CMP20260102", name: "Amit Singh", mobile: "9876543212", type: "Garbage Collection", location: "Sector 22, Rohini", submittedAt: "2026-07-10T14:20:00", status: "நடவடிக்கை எடுக்கப்பட்டது" },
  { id: 4, number: "CMP20260103", name: "Priya Sharma", mobile: "9876543213", type: "Street Light", location: "Phase 2, Gurgaon", submittedAt: "2026-07-10T08:45:00", status: "தீர்க்கப்பட்டது" },
  { id: 5, number: "CMP20260104", name: "Vikram Patel", mobile: "9876543214", type: "Drainage", location: "Street 5, Faridabad", submittedAt: "2026-07-09T16:00:00", status: "நடவடிக்கை எடுக்கப்பட்டது" },
  { id: 6, number: "CMP20260105", name: "Neha Gupta", mobile: "9876543215", type: "Water Supply", location: "Sector 44, Noida", submittedAt: "2026-07-08T11:30:00", status: "தீர்க்கப்பட்டது" },
  { id: 7, number: "CMP20260106", name: "Rajesh Verma", mobile: "9876543216", type: "Noise Complaint", location: "Green Valley, Delhi", submittedAt: "2026-07-08T22:15:00", status: "பரிசீலனையில் உள்ளது" },
  { id: 8, number: "CMP20260107", name: "Anita Joshi", mobile: "9876543217", type: "Road Damage", location: "Market Road, Lajpat Nagar", submittedAt: "2026-07-07T13:00:00", status: "தீர்க்கப்பட்டது" },
];

const COMPLAINT_TYPES = ["Water Supply", "Road Damage", "Garbage Collection", "Street Light", "Drainage", "Noise Complaint"];

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    total: MOCK_COMPLAINTS.length,
    pending: MOCK_COMPLAINTS.filter(c => c.status === "பரிசீலனையில் உள்ளது").length,
    action: MOCK_COMPLAINTS.filter(c => c.status === "நடவடிக்கை எடுக்கப்பட்டது").length,
    resolved: MOCK_COMPLAINTS.filter(c => c.status === "தீர்க்கப்பட்டது").length,
  }), []);

  const typeStats = useMemo(() => {
    return COMPLAINT_TYPES.map(type => ({
      type,
      count: MOCK_COMPLAINTS.filter(c => c.type === type).length,
    }));
  }, []);

  const statusCounts = [
    { label: "பரிசீலனையில்", count: stats.pending, color: "#d97706", bgColor: "#fffbeb" },
    { label: "நடவடிக்கை எடுக்கப்பட்டது", count: stats.action, color: "#2563eb", bgColor: "#eff6ff" },
    { label: "தீர்க்கப்பட்டது", count: stats.resolved, color: "#16a34a", bgColor: "#f0fdf4" },
  ];

  const maxCount = Math.max(...statusCounts.map(s => s.count), 1);

  const latestComplaints = MOCK_COMPLAINTS.slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#1a2332" }}>கட்டுப்பாட்டு பலகம்</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("ta-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border" style={{ borderColor: "#e5e7eb" }}>
          <MapPin size={16} style={{ color: "#1D6FB9" }} />
          <span className="text-sm font-semibold" style={{ color: "#1D6FB9" }}>தமிழ்நாடு அரசு</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[
          { icon: MessageSquare, label: "மொத்த குறைகள்", value: stats.total, color: "#1D6FB9", bgColor: "#eef4fa", change: "+12%" },
          { icon: Clock, label: "பரிசீலனையில்", value: stats.pending, color: "#d97706", bgColor: "#fffbeb", change: "-2%" },
          { icon: AlertTriangle, label: "நடவடிக்கை எடுக்கப்பட்டது", value: stats.action, color: "#2563eb", bgColor: "#eff6ff", change: "+5%" },
          { icon: CheckCircle, label: "தீர்க்கப்பட்டது", value: stats.resolved, color: "#16a34a", bgColor: "#f0fdf4", change: "+18%" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bgColor }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full hidden sm:inline" style={{ backgroundColor: card.bgColor, color: card.color }}>
                {card.change}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: "#1a2332" }}>{card.value}</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Status Distribution + Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Status Distribution Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm lg:col-span-1" style={{ borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-sm sm:text-base mb-4 sm:mb-5" style={{ color: "#1a2332" }}>நிலை விபரம்</h3>
          <div className="space-y-3 sm:space-y-4">
            {statusCounts.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs sm:text-sm font-medium" style={{ color: s.color }}>{s.label}</span>
                  <span className="text-xs sm:text-sm font-bold" style={{ color: "#1a2332" }}>{s.count}</span>
                </div>
                <div className="w-full h-2 sm:h-3 rounded-full" style={{ backgroundColor: "#f3f4f6" }}>
                  <div className="h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${(s.count / maxCount) * 100}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-500">தீர்வு விகிதம்</span>
              <span className="text-base sm:text-lg font-extrabold" style={{ color: "#16a34a" }}>
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Complaint Type Distribution */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm lg:col-span-1" style={{ borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-sm sm:text-base mb-4 sm:mb-5" style={{ color: "#1a2332" }}>குறை வகைகள்</h3>
          <div className="space-y-2 sm:space-y-3">
            {typeStats.map(t => {
              const pct = stats.total > 0 ? (t.count / stats.total) * 100 : 0;
              return (
                <div key={t.type} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">{t.type}</span>
                      <span className="text-xs font-bold" style={{ color: "#1D6FB9" }}>{t.count}</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#eef4fa" }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: "#1D6FB9" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border shadow-sm lg:col-span-1" style={{ borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-sm sm:text-base mb-4 sm:mb-5" style={{ color: "#1a2332" }}>விரைவு செயல்கள்</h3>
          <div className="space-y-2 sm:space-y-3">
            <button onClick={() => navigate("/complaints")} className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98]" style={{ backgroundColor: "#eef4fa" }}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1D6FB9" }}>
                <MessageSquare size={18} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold" style={{ color: "#1a2332" }}>குறைகளை நிர்வகிக்க</div>
                <div className="text-xs text-gray-500 hidden sm:block">அனைத்து குறைகளையும் பார்க்க</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98]" style={{ backgroundColor: "#fffbeb" }}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#d97706" }}>
                <Clock size={18} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold" style={{ color: "#1a2332" }}>நிலுவையில் உள்ள குறைகள்</div>
                <div className="text-xs text-gray-500">{stats.pending} குறைகள் பரிசீலனையில்</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98]" style={{ backgroundColor: "#f0fdf4" }}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#16a34a" }}>
                <CheckCircle size={18} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold" style={{ color: "#1a2332" }}>தீர்க்கப்பட்ட குறைகள்</div>
                <div className="text-xs text-gray-500">{stats.resolved} குறைகள் தீர்க்கப்பட்டன</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Complaints - Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border shadow-lg overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: "#e5e7eb", backgroundColor: "#f8fafc" }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: "#1D6FB9" }} />
            <div>
              <h2 className="text-base font-bold" style={{ color: "#1a2332" }}>சமீபத்திய குறைகள்</h2>
              <p className="text-xs text-gray-400 mt-0.5">சமீபத்தில் பதிவு செய்யப்பட்ட குறைகள்</p>
            </div>
          </div>
          <button onClick={() => navigate("/complaints")} className="text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-md flex items-center gap-1 w-fit" style={{ color: "#1D6FB9", backgroundColor: "#eef4fa", border: "1px solid #d9e6f5" }}>
            அனைத்தும் பார்க்க <span className="text-sm">→</span>
          </button>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y sm:hidden" style={{ borderColor: "#f3f4f6" }}>
          {latestComplaints.map((c) => {
            const st = c.status === "பரிசீலனையில் உள்ளது" 
              ? { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "பரிசீலனையில்" }
              : c.status === "நடவடிக்கை எடுக்கப்பட்டது" 
              ? { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", label: "நடவடிக்கை" }
              : { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "தீர்க்கப்பட்டது" };
            return (
              <div key={c.id} onClick={() => navigate("/complaints")} className="p-4 hover:bg-gray-50/60 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#1D6FB9" }}>{c.name.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{c.name}</div>
                      <div className="text-xs text-gray-400">{c.mobile}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>
                <div className="space-y-1 ml-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">வகை:</span>
                    <span className="font-medium text-gray-600">{c.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">இடம்:</span>
                    <span className="text-gray-600">{c.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "#f3f4f6" }}>
                    <span className="text-xs text-gray-400 font-mono">{c.number}</span>
                    <span className="text-xs text-gray-400">{new Date(c.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "#f3f4f6" }}>
                <th className="text-left px-6 sm:px-8 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>குறை எண்</th>
                <th className="text-left px-6 sm:px-8 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>புகார்தாரர்</th>
                <th className="text-left px-6 sm:px-8 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>வகை</th>
                <th className="text-left px-6 sm:px-8 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>இடம்</th>
                <th className="text-left px-6 sm:px-8 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>தேதி</th>
                <th className="text-right px-6 sm:px-8 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>நிலை</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#f9fafb" }}>
              {latestComplaints.map((c) => {
                const st = c.status === "பரிசீலனையில் உள்ளது" 
                  ? { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "பரிசீலனையில்" }
                  : c.status === "நடவடிக்கை எடுக்கப்பட்டது" 
                  ? { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", label: "நடவடிக்கை" }
                  : { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "தீர்க்கப்பட்டது" };
                return (
                  <tr key={c.id} onClick={() => navigate("/complaints")} className="hover:bg-gray-50/60 transition-all cursor-pointer">
                    <td className="px-6 sm:px-8 py-4">
                      <span className="text-sm font-mono font-semibold" style={{ color: "#1D6FB9" }}>{c.number}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#1D6FB9" }}>{c.name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "#1a2332" }}>{c.name}</div>
                          <div className="text-xs text-gray-400">{c.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <span className="text-sm font-medium text-gray-600">{c.type}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <span className="text-sm text-gray-500">{c.location}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <span className="text-sm text-gray-500">{new Date(c.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff, Lock, Phone, LogIn } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(mobile, password);
      if (result.success) {
        toast.success(`வரவேற்கிறோம், ${result.user.name}!`);
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error(result.error || "கைபேசி எண் அல்லது கடவுச்சொல் தவறானது");
      }
    } catch (err) {
      toast.error("உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#f0f4f8" }}>
      <div className="w-full max-w-sm">
        {/* Logo stacked vertically - icon on top, text below */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 rounded-2xl bg-white shadow-xl overflow-hidden flex items-center justify-center mb-4">
            <img src="/icons/tvk.jfif" alt="TVK logo" className="h-16 w-16 object-contain" />
          </div>
          <span className="text-2xl font-extrabold tracking-wide" style={{ color: "#7a0000" }}>நிர்வாகம்</span>
          
        </div>

        {/* Login Card - cleaner with less padding */}
        <div className="rounded-2xl bg-white px-7 py-8 shadow-lg border" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-lg font-bold text-center mb-1" style={{ color: "#1a2332" }}></h2>
          <p className="text-gray-400 text-xs text-center mb-7">உங்கள் கணக்கில் உள்நுழையவும்</p>

          <form onSubmit={handleLogin} className="space-y-4.5">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>கைபேசி எண்</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center" style={{ color: "#7a0000" }}>
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  required
                  className="w-full border rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb", color: "#1a2332" }}
                  onFocus={e => { e.target.style.borderColor = "#7a0000"; e.target.style.boxShadow = "0 0 0 3px rgba(122,0,0,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>கடவுச்சொல்</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center" style={{ color: "#7a0000" }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border rounded-xl pl-9 pr-10 py-3 text-sm outline-none transition-all duration-200"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb", color: "#1a2332" }}
                  onFocus={e => { e.target.style.borderColor = "#7a0000"; e.target.style.boxShadow = "0 0 0 3px rgba(122,0,0,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#7a0000", boxShadow: "0 8px 20px rgba(122, 0, 0, 0.25)" }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.backgroundColor = '#5c0000'; e.target.style.boxShadow = '0 10px 24px rgba(122, 0, 0, 0.30)'; } }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#7a0000'; e.target.style.boxShadow = '0 8px 20px rgba(122, 0, 0, 0.25)'; }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>உள்நுழைகிறது...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>உள்நுழைக</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
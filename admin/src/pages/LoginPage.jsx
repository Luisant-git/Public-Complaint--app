import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import icon from "/icons/app-icon.svg";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success(`வரவேற்கிறோம், ${result.user.name}!`);
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error(result.error || "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது");
      }
    } catch (err) {
      toast.error("உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f0f4f8" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <img src={icon} alt="Logo" className="h-16 w-16" />
            <span className="text-2xl font-extrabold" style={{ color: "#1D6FB9" }}>நிர்வாகம்</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg border" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#1a2332" }}>மீண்டும் வருக!</h2>
          <p className="text-gray-500 text-sm text-center mb-6">உங்கள் கணக்கில் உள்நுழையவும்</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>மின்னஞ்சல்</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "#eef4fa" }}>
                  <Mail size={18} style={{ color: "#1D6FB9" }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="உங்கள் மின்னஞ்சலை உள்ளிடவும்"
                  required
                  className="w-full border rounded-2xl pl-14 pr-4 py-3.5 text-sm outline-none transition-all duration-200"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb", color: "#1a2332" }}
                  onFocus={e => { e.target.style.borderColor = "#1D6FB9"; e.target.style.boxShadow = "0 0 0 4px rgba(29,111,185,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>கடவுச்சொல்</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "#eef4fa" }}>
                  <Lock size={18} style={{ color: "#1D6FB9" }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="உங்கள் கடவுச்சொல்லை உள்ளிடவும்" 
                  required
                  className="w-full border rounded-2xl pl-14 pr-12 py-3.5 text-sm outline-none transition-all duration-200"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb", color: "#1a2332" }}
                  onFocus={e => { e.target.style.borderColor = "#1D6FB9"; e.target.style.boxShadow = "0 0 0 4px rgba(29,111,185,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(p => !p)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white font-bold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1D6FB9", boxShadow: "0 10px 24px rgba(29, 111, 185, 0.28)" }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.backgroundColor = '#165a94'; e.target.style.boxShadow = '0 12px 28px rgba(29, 111, 185, 0.34)'; }}}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#1D6FB9'; e.target.style.boxShadow = '0 10px 24px rgba(29, 111, 185, 0.28)'; }}
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
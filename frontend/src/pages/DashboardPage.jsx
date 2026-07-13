import { Bell, ClipboardPlus, Download, MapPinned, Phone, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "../components/Header";
import { useComplaint } from "../context/ComplaintContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { isOnline, userProfile } = useComplaint();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [barDismissed, setBarDismissed] = useState(
    () => localStorage.getItem("install_bar_dismissed") === "true"
  );
  const [isInstalled] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  );
  const storedName = localStorage.getItem("user_name")?.trim();
  const storedMobile = localStorage.getItem("user_mobile")?.trim();
  const userName = userProfile?.name?.trim() || storedName || "பயனர்";
  const userMobile = userProfile?.mobile?.trim() || storedMobile || "—";

  useEffect(() => {
    const capturePrompt = (event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
  }, []);

  const installApp = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallPrompt(null);
        setBarDismissed(true);
        localStorage.setItem("install_bar_dismissed", "true");
      }
    } else {
      toast.info("Use browser menu (⋮) → 'Add to Home screen'.", { autoClose: 6000 });
    }
  };

  const dismissBar = () => {
    setBarDismissed(true);
    localStorage.setItem("install_bar_dismissed", "true");
  };

  const actions = [
    { label: "புதிய குறை பதிவு", hint: "குறையை பதிவு செய்ய", Icon: ClipboardPlus, style: "bg-gradient-to-br from-[#9f0100] to-[#9f0100] text-white", onClick: () => navigate("/complaint-types") },
    { label: "குறை நிலை", hint: "பதிவின் நிலையை அறிய", Icon: MapPinned, style: "bg-gradient-to-br from-amber-500 to-amber-600 text-white", onClick: () => navigate("/status") },
    { label: "அறிவிப்புகள்", hint: "புதிய தகவல்களைப் பார்க்க", Icon: Bell, style: "bg-gradient-to-br from-violet-500 to-violet-600 text-white", onClick: () => {} },
  ];

  const showBar = !isInstalled && !barDismissed;

  return (
    <main className="min-h-dvh">
      <Header title="குறை தீர்க்கும் பயண்பாடு" />

      {/* ── Install top-bar toast ── */}
      {showBar && (
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 border-b border-amber-200">
          <Download className="h-4 w-4 shrink-0 text-amber-700" />
          <p className="flex-1 text-[13px] font-medium text-amber-800">
            Install app for quick access
          </p>
          <button
            onClick={installApp}
            className="shrink-0 rounded-lg bg-[#9f0100] px-3.5 py-1.5 text-[12px] font-bold text-white active:scale-95 transition-all"
          >
            Install
          </button>
          <button
            onClick={dismissBar}
            className="shrink-0 text-[20px] font-light leading-none text-amber-400 hover:text-amber-600 transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      <div className="px-4 pt-5 pb-6 space-y-5">
        {/* Greeting section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900">
              வணக்கம், {userName}
            </h1>
            <p className="mt-1 text-[14px] text-gray-500 leading-relaxed">
              இன்று உங்கள் குறையை பதிவு செய்யுங்கள்
            </p>
          </div>
          {!isOnline && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
              <WifiOff className="h-3.5 w-3.5" /> இணையமில்லை
            </span>
          )}
        </div>

        {/* User card */}
        <div className="rounded-2xl bg-white px-4 py-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#9f0100] to-[#9f0100] text-white shadow-sm">
              <Phone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                பயனர் விவரம்
              </p>
              <p className="mt-0.5 text-[15px] font-bold text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-[13px] font-medium text-gray-500">
                {userMobile}
              </p>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-gray-400 pl-0.5">
            விரைவு செயல்கள்
          </h2>
          <div className="space-y-3">
            {actions.map(({ label, hint, Icon, style, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left shadow-sm transition active:scale-[0.98] ${style}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold">{label}</span>
                  <span className="mt-0.5 block text-[12px] font-medium text-white/70">{hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>


      </div>
    </main>
  );
}
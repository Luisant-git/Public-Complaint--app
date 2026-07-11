import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LayoutDashboard, MessageSquare, LogOut, Bell, Search, Menu, X, ChevronDown, User } from "lucide-react";
import icon from "/icons/app-icon.svg";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, taLabel: "கட்டுப்பாட்டு பலகம்" },
  { path: "/complaints", icon: MessageSquare, taLabel: "குறை மேலாண்மை" },
];

export default function WebLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f0f4f8" }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 bg-white border-r flex flex-col transition-all duration-300 shadow-sm flex-shrink-0 ${sidebarOpen ? "w-64" : "md:w-16 w-64"}`} style={{ borderColor: "#e5e7eb" }}>
        {/* Logo */}
        <div className="h-24 flex items-center justify-center px-4 border-b relative" style={{ borderColor: "#e5e7eb" }}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm overflow-hidden">
                <img src="/icons/tnlogo.png" alt="TN logo" className="h-10 w-10 object-contain" />
              </div>
              <span className="text-lg font-extrabold" style={{ color: "#1D6FB9" }}>நிர்வாகம்</span>
            </div>
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm overflow-hidden">
              <img src="/icons/tnlogo.png" alt="TN logo" className="h-8 w-8 object-contain" />
            </div>
          )}
        
          {/* Mobile: explicit close inside sidebar for visibility */}
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-2 rounded-lg">
            <X size={18} />
          </button>

        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.taLabel : ""}
                className={`w-full sidebar-link ${active ? "sidebar-link-active" : "sidebar-link-inactive"}`}>
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate text-base">{item.taLabel}</span>}
              </button>
            );
          })}
        </nav>

        {/* User info + Logout */}
        <div className="p-3 border-t" style={{ borderColor: "#e5e7eb" }}>
          {sidebarOpen && user && (
            <div className="flex items-center gap-2 px-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#1D6FB9" }}>
                {user.name?.charAt(0)}
              </div>
              <div className="text-sm font-semibold truncate" style={{ color: "#1a2332" }}>{user.name}</div>
            </div>
          )}
          <button onClick={handleLogout} className="w-full sidebar-link sidebar-link-inactive flex items-center gap-2 px-2 py-2 rounded-xl transition-colors hover:bg-red-50" style={{ color: "#dc2626" }}>
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">வெளியேறு</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 shadow-sm" style={{ borderColor: "#e5e7eb" }}>
          <button onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle sidebar" aria-expanded={sidebarOpen} className="text-gray-400 hover:text-gray-700 transition-colors md:hidden p-2 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors hidden md:block">
            <X size={20} />
          </button>}

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="தேடுக..." className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }} />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#1D6FB9" }} />
            </button>

            <div className="relative">
              <button onClick={() => setShowUserMenu(p => !p)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#1D6FB9" }}>
                  {user?.name?.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold leading-tight" style={{ color: "#1a2332" }}>{user?.name}</div>
                  <div className="text-xs" style={{ color: "#1D6FB9" }}>{user?.role}</div>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-50" style={{ borderColor: "#e5e7eb" }}>
                  <div className="border-t" style={{ borderColor: "#e5e7eb" }} />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50" style={{ color: "#dc2626" }}>
                    <LogOut size={14} /> வெளியேறு
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fadeIn" style={{ backgroundColor: "#f0f4f8" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
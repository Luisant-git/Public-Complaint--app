import { Bell, CircleUserRound, House, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "முகப்பு", Icon: House },
  { to: "/status", label: "குறை நிலை", Icon: MapPinned },
  { label: "அறிவிப்புகள்", Icon: Bell, isNotification: true },
  { to: "/profile", label: "சுயவிவரம்", Icon: CircleUserRound },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex h-[72px] max-w-[390px] items-center justify-around border-t border-slate-100 bg-white/95 px-2 pb-[max(0px,env(safe-area-inset-bottom))] backdrop-blur">
      {items.map((item) =>
        item.isNotification ? (
          <button
            key="notification"
            type="button"
            aria-label="அறிவிப்புகள்"
            className="flex min-w-[66px] flex-col items-center gap-1 py-2 text-[10px] font-bold transition text-slate-400"
          >
            <span className="grid h-7 w-10 place-items-center rounded-full">
              <item.Icon className="h-[19px] w-[19px]" />
            </span>
            <span className="text-[9px] font-bold leading-none whitespace-nowrap">{item.label}</span>
          </button>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-w-[66px] flex-col items-center gap-1 py-2 text-[10px] font-bold transition ${isActive ? "text-[#9f0100]" : "text-slate-400"}`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-7 w-10 place-items-center rounded-full ${isActive ? "bg-[#fff7e8]" : ""}`}
                >
                  <item.Icon className="h-[19px] w-[19px]" strokeWidth={isActive ? 2.7 : 2} />
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        )
      )}
    </nav>
  );
}

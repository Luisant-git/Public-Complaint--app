import { Outlet, useLocation } from "react-router-dom";
import { BottomNavigation } from "../components/BottomNavigation";

const bottomNavigationPaths = ["/dashboard", "/status", "/notifications", "/profile"];

export function AppShell() {
  const location = useLocation();
  return <div className="app-canvas"><Outlet />{bottomNavigationPaths.includes(location.pathname) && <BottomNavigation />}</div>;
}
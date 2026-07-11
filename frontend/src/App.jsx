import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ComplaintProvider } from "./context/ComplaintContext";
import { AppShell } from "./layouts/AppShell";
import { ComplaintFormPage } from "./pages/ComplaintFormPage";
import { ComplaintSuccessPage } from "./pages/ComplaintSuccessPage";
import { ComplaintTypesPage } from "./pages/ComplaintTypesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SplashPage } from "./pages/SplashPage";
import { StatusPage } from "./pages/StatusPage";

export default function App() {
  return (
    <ComplaintProvider>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complaint-types" element={<ComplaintTypesPage />} />
          <Route path="/survey-types" element={<ComplaintTypesPage />} />
          <Route path="/complaint/:id" element={<ComplaintFormPage />} />
          <Route path="/survey/:id" element={<ComplaintFormPage />} />
          <Route path="/success/:number" element={<ComplaintSuccessPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/history" element={<StatusPage />} />
          <Route path="/history/:id" element={<StatusPage />} />
          {/* <Route path="/notifications" element={<NotificationsPage />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2600} closeButton theme="light" />
    </ComplaintProvider>
  );
}
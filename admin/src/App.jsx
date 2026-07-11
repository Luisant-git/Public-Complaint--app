import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import WebLayout from "./layouts/WebLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComplaintManagement from "./pages/ComplaintManagement.jsx";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <WebLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/complaints" element={<ComplaintManagement />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </WebLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastStyle={{ borderRadius: "12px", fontSize: "14px" }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
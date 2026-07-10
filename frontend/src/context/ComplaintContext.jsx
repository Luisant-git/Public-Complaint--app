import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getOfflineComplaints, removeOfflineComplaint, saveOfflineComplaint } from "../utils/offlineStore";

const ComplaintContext = createContext(null);

function createComplaintNumber() {
  const now = new Date();
  const datePart = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("");
  return `CMP${datePart}${Math.floor(1000 + Math.random() * 9000)}`;
}

export function ComplaintProvider({ children }) {
  const [currentComplaint, setCurrentComplaint] = useState(() => {
    const saved = localStorage.getItem("current_complaint");
    return saved ? JSON.parse(saved) : null;
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) return;
    getOfflineComplaints().then((complaints) => complaints.forEach((complaint) => removeOfflineComplaint(complaint.number)));
  }, [isOnline]);

  const submitComplaint = async (formData, type) => {
    const complaint = { ...formData, type, number: createComplaintNumber(), submittedAt: new Date().toISOString(), status: "பரிசீலனையில் உள்ளது" };
    setCurrentComplaint(complaint);
    localStorage.setItem("current_complaint", JSON.stringify(complaint));
    if (!navigator.onLine) await saveOfflineComplaint(complaint);
    return complaint;
  };

  const value = useMemo(() => ({ currentComplaint, submitComplaint, isOnline }), [currentComplaint, isOnline]);
  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaint() {
  const context = useContext(ComplaintContext);
  if (!context) throw new Error("useComplaint must be used inside ComplaintProvider");
  return context;
}
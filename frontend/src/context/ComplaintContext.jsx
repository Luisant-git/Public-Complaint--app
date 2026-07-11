import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { complaintsApi } from "../api/complaints";

const ComplaintContext = createContext(null);

function getStoredUserProfile() {
  if (typeof window === "undefined") return null;
  const name = window.localStorage.getItem("user_name") || "";
  const mobile = window.localStorage.getItem("user_mobile") || "";
  if (!name && !mobile) return null;
  return { name, mobile };
}

export function ComplaintProvider({ children }) {
  const [currentComplaint, setCurrentComplaint] = useState(() => {
    const saved = localStorage.getItem("current_complaint");
    return saved ? JSON.parse(saved) : null;
  });
  const [userProfile, setUserProfileState] = useState(() => getStoredUserProfile());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const stored = getStoredUserProfile();
    if (!userProfile && stored) {
      setUserProfileState(stored);
    }
  }, [userProfile]);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  /** Submit a complaint via the real API */
  const submitComplaint = async (formData, type) => {
    const payload = {
      type,
      location: formData.place,
      description: formData.remarks,
      images: formData.images || [],
    };

    const complaint = await complaintsApi.submit(payload);

    // Store the complaint locally so status page can show it
    const local = {
      id: complaint.id,
      number: complaint.number,
      type: complaint.type,
      location: complaint.location,
      description: complaint.description,
      status: complaint.status,
      submittedAt: complaint.createdAt,
    };
    setCurrentComplaint(local);
    localStorage.setItem("current_complaint", JSON.stringify(local));
    return local;
  };

  const setUserProfile = (profile) => {
    const nextProfile = {
      name: profile?.name || "",
      mobile: profile?.mobile || "",
    };

    setUserProfileState(nextProfile.name || nextProfile.mobile ? nextProfile : null);

    if (!window.localStorage) return;
    if (nextProfile.name || nextProfile.mobile) {
      window.localStorage.setItem("user_name", nextProfile.name);
      window.localStorage.setItem("user_mobile", nextProfile.mobile);
    } else {
      window.localStorage.removeItem("user_name");
      window.localStorage.removeItem("user_mobile");
    }
  };

  const clearUserProfile = () => {
    setUserProfileState(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user_name");
      window.localStorage.removeItem("user_mobile");
      window.localStorage.removeItem("user_id");
      window.localStorage.removeItem("complaint_token");
      window.localStorage.removeItem("current_complaint");
    }
  };

  const value = useMemo(
    () => ({ currentComplaint, submitComplaint, isOnline, userProfile, setUserProfile, clearUserProfile }),
    [currentComplaint, isOnline, userProfile]
  );

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaint() {
  const context = useContext(ComplaintContext);
  if (!context) throw new Error("useComplaint must be used inside ComplaintProvider");
  return context;
}
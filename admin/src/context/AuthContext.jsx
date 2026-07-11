import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Mock admin users for complaint management
const MOCK_USERS = [
  { id: 1, name: "Arjun Mehta", email: "admin@complaint.gov", password: "1234", role: "Admin", mobile: "9876543210", employeeCode: "AD001" },
  { id: 2, name: "Priya Sharma", email: "director@complaint.gov", password: "1234", role: "Director", mobile: "9876543211", employeeCode: "D001" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("re_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (identifier, password) => {
    const normalizedIdentifier = identifier?.trim().toLowerCase();

    const found = MOCK_USERS.find(u => {
      if (!u?.password) return false;
      const emailMatches = u.email?.toLowerCase() === normalizedIdentifier;
      const userIdMatches = u.employeeCode?.toLowerCase() === normalizedIdentifier;
      return (emailMatches || userIdMatches) && u.password === password;
    });

    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("re_user", JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }

    return { success: false, error: "Invalid user ID or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("re_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
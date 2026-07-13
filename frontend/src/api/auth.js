// src/api/auth.js  — Frontend public-user auth
const API = import.meta.env.VITE_API_URL;

const handle = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
};

export const authApi = {
  /** Login or auto-register a user by name + mobile */
  async loginUser(name, mobile) {
    const res = await fetch(`${API}/auth/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile }),
    });
    const data = await handle(res);
    // Persist token & profile
    localStorage.setItem('complaint_token', data.accessToken);
    localStorage.setItem('user_name', data.user.name);
    localStorage.setItem('user_mobile', data.user.mobile);
    localStorage.setItem('user_id', String(data.user.id));
    return data;
  },

  logout() {
    localStorage.removeItem('complaint_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_mobile');
    localStorage.removeItem('user_id');
    localStorage.removeItem('current_complaint');
  },

  getToken() {
    return localStorage.getItem('complaint_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('complaint_token');
  },
};

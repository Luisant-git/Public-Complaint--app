// src/api/complaints.js — Frontend complaints API
const API = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('complaint_token');
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const handle = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
};

export const complaintsApi = {
  /** Submit a new complaint (authenticated user) */
  async submit({ type, location, description, images }) {
    const res = await fetch(`${API}/complaints`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type, location, description, images }),
    });
    return handle(res);
  },

  /** Get all complaints belonging to the logged-in user */
  async myComplaints() {
    const res = await fetch(`${API}/complaints/my`, {
      headers: authHeaders(),
    });
    return handle(res);
  },
};

// src/api/complaints.js
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) throw new Error('Request failed');
    return null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

const getAuthToken = () => localStorage.getItem("authToken");
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getAuthToken()}`,
});

export const complaintsApi = {
  async getComplaints(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.type && filters.type !== 'All') params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);

    const url = `${VITE_API_URL}/complaints?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updateComplaint(id, updateData) {
    const response = await fetch(`${VITE_API_URL}/complaints/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  async getStats() {
    const response = await fetch(`${VITE_API_URL}/complaints/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

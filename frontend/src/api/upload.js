// src/api/upload.js
// Helper to upload a single image file to the backend.

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${VITE_API_URL}/upload/image`, {
    method: 'POST',
    body: formData,
    // Let browser set Content-Type with multipart boundary.
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Image upload failed: ${err}`);
  }

  const data = await response.json();
  // Expected { filename, url, sizeMB }
  return data.url;
}

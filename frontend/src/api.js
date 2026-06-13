import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://nayepankh-foundation-volunteer.onrender.com/api', // Points to Render backend by default
});

// This automatically attaches your Admin JWT token to every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
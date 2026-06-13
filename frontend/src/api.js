import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Points directly to your Express server
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
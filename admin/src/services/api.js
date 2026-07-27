import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  checkAuth: () => api.get('/auth/check'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

export const packageAPI = {
  getAll: () => api.get('/packages'),
  getOne: (id) => api.get(`/packages/${id}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
  getStats: () => api.get('/packages/stats'),
};

export const maintenanceAPI = {
  getAll: () => api.get('/maintenance'),
  getOne: (id) => api.get(`/maintenance/${id}`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  delete: (id) => api.delete(`/maintenance/${id}`),
  getStats: () => api.get('/maintenance/stats'),
};

export const notificationAPI = {
  sendToUser: (data) => api.post('/notifications/send-to-user', data),
  sendToAdmins: (data) => api.post('/notifications/send-to-admins', data),
  sendToTopic: (data) => api.post('/notifications/send-to-topic', data),
};

export default api;

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
  updateAccount: (data) => api.put('/auth/update-account', data),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
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

export const settingsAPI = {
  getTheme: () => api.get('/settings/theme'),
  updateTheme: (paletteId) => api.put('/settings/theme', { paletteId }),
  getManifesto: () => api.get('/settings/manifesto'),
  updateManifesto: (data) => api.put('/settings/manifesto', data),
  getHeroScene: () => api.get('/settings/hero-scene'),
  updateHeroScene: (sceneId) => api.put('/settings/hero-scene', { sceneId }),
};

export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads/admin', data),
  update: (id, data) => api.patch(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  getStats: () => api.get('/leads/stats'),
  convert: (id, data) => api.post(`/leads/${id}/convert`, data),
};

export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.patch(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getStats: () => api.get('/projects/stats'),
  createMilestone: (projectId, data) => api.post(`/projects/${projectId}/milestones`, data),
  updateMilestone: (projectId, milestoneId, data) =>
    api.patch(`/projects/${projectId}/milestones/${milestoneId}`, data),
  deleteMilestone: (projectId, milestoneId) =>
    api.delete(`/projects/${projectId}/milestones/${milestoneId}`),
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (projectId, taskId, data) =>
    api.patch(`/projects/${projectId}/tasks/${taskId}`, data),
  deleteTask: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
};

export const salesAPI = {
  getStats: () => api.get('/sales/stats'),
  getQuotes: (params) => api.get('/sales/quotes', { params }),
  getQuote: (id) => api.get(`/sales/quotes/${id}`),
  createQuote: (data) => api.post('/sales/quotes', data),
  updateQuote: (id, data) => api.patch(`/sales/quotes/${id}`, data),
  deleteQuote: (id) => api.delete(`/sales/quotes/${id}`),
  quoteToContract: (id) => api.post(`/sales/quotes/${id}/to-contract`),
  quoteToInvoice: (id) => api.post(`/sales/quotes/${id}/to-invoice`),
  getContracts: (params) => api.get('/sales/contracts', { params }),
  getContract: (id) => api.get(`/sales/contracts/${id}`),
  createContract: (data) => api.post('/sales/contracts', data),
  updateContract: (id, data) => api.patch(`/sales/contracts/${id}`, data),
  deleteContract: (id) => api.delete(`/sales/contracts/${id}`),
  contractToInvoice: (id) => api.post(`/sales/contracts/${id}/to-invoice`),
  getInvoices: (params) => api.get('/sales/invoices', { params }),
  getInvoice: (id) => api.get(`/sales/invoices/${id}`),
  createInvoice: (data) => api.post('/sales/invoices', data),
  updateInvoice: (id, data) => api.patch(`/sales/invoices/${id}`, data),
  deleteInvoice: (id) => api.delete(`/sales/invoices/${id}`),
};

export const statsAPI = {
  getOverview: () => api.get('/stats/overview'),
};

export default api;

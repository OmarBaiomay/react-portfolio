import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const frontendApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicAPI = {
  getPackages: () => frontendApi.get('/packages'),
  getMaintenancePlans: () => frontendApi.get('/maintenance'),
  getTheme: () => frontendApi.get('/settings/theme'),
  getManifesto: () => frontendApi.get('/settings/manifesto'),
  getHeroScene: () => frontendApi.get('/settings/hero-scene'),
  createLead: (data) => frontendApi.post('/leads', data),
};

export default frontendApi;

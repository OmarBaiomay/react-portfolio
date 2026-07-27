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
};

export default frontendApi;

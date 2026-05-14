import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const incidentService = {
  getAll: () => api.get('/incidents'),
  report: (data: any) => api.post('/incidents', data),
};

export default api;

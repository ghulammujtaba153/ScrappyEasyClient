import axios from 'axios';
import { BASE_URL } from '../config/URL.jsx';


const api = axios.create({ baseURL: `${BASE_URL}/api` });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

import axios from 'axios';
import { BASE_URL } from '../config/URL';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const startWhatsAppConnect = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return `${BASE_URL}/api/whatsapp/account/connect?token=${token}`;
};

export const getWabas = () => {
  return api.get('/api/whatsapp/account/wabas');
};

export const getPhoneNumbers = (wabaId) => {
  return api.get(`/api/whatsapp/account/numbers/${wabaId}`);
};

export const savePhoneNumber = (payload) => {
  return api.post('/api/whatsapp/account/save-number', payload);
};

export const sendMessage = (payload) => {
  return api.post('/api/whatsapp/account/send', payload);
};
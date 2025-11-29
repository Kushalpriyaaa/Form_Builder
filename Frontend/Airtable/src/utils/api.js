import axios from 'axios';
import.meta.env

// eslint-disable-next-line no-undef
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const instance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

function setToken(token) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete instance.defaults.headers.common['Authorization'];
}

export default {
  setToken,
  get: (url, config) => instance.get(url, config).then(r => r.data),
  post: (url, data, config) => instance.post(url, data, config).then(r => r.data),
  put: (url, data, config) => instance.put(url, data, config).then(r => r.data),
  delete: (url, config) => instance.delete(url, config).then(r => r.data),
  raw: instance
};

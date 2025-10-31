import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL do backend Laravel
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

export default api;

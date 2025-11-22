import axios from 'axios';

const api = axios.create({
    baseURL : process.env.REACT_APP_API_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (err) => Promise.reject(err));

export default api;
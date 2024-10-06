import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',  // Set your base URL here
});

export const loginAdmin = (data) => API.post('/admin/login', data);

export const getAdminDetails = (token) =>
  API.get('/admin/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default API;

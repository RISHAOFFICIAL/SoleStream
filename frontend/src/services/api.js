import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Response interceptor for simplified data access and error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
};

export const listingsAPI = {
  getListings: (params) => apiClient.get('/listings', { params }),
  getListing: (id) => apiClient.get(`/listings/${id}`),
};

export const adminAPI = {
  createListing: (formData) => apiClient.post('/admin/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateListing: (id, data) => apiClient.put(`/admin/listings/${id}`, data),
  deleteListing: (id) => apiClient.delete(`/admin/listings/${id}`),
  getListings: () => apiClient.get('/admin/listings'),
  getAnalytics: () => apiClient.get('/admin/analytics'),
};

export const checkoutAPI = {
  createSession: (data) => apiClient.post('/checkout/create-session', data),
};

export default apiClient;

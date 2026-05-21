import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

export const profileService = {
  saveProfile: (data: any) => api.post('/profile', data),
  getProfile: () => api.get('/profile'),
};

export const collegeService = {
  getColleges: (params: any) => api.get('/colleges', { params }),
  getRecommendations: () => api.get('/colleges/recommendations'),
  getCollegeDetails: (id: string) => api.get(`/colleges/${id}`),
  addFavorite: (collegeId: string) => api.post('/favorites', { collegeId }),
  removeFavorite: (collegeId: string) => api.delete(`/favorites/${collegeId}`),
  getFavorites: () => api.get('/favorites'),
};

export const chatService = {
  sendMessage: (message: string) => api.post('/chat/message', { message }),
  getChatHistory: () => api.get('/chat/history'),
};

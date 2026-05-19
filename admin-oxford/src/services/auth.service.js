// src/services/auth.service.js
import api from '../config/api.config';

export const authService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register admin
  register: async (credentials) => {
    try {
      const response = await api.post('/admin/register', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('adminToken');
  },
};
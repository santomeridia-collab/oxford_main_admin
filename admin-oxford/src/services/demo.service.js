// src/services/demo.service.js
import api from '../config/api.config';

export const demoService = {
  // Get all demo requests
  getDemos: async () => {
    try {
      const response = await api.get('/demo');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
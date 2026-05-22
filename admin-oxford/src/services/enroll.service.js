// src/services/enroll.service.js
import api from '../config/api.config';

export const enrollService = {
  // Get all enrollments
  getEnrolls: async () => {
    try {
      const response = await api.get('/enroll');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
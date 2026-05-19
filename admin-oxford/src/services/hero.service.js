// src/services/hero.service.js
import api from '../config/api.config';

export const heroService = {
  // Get hero
  getHero: async () => {
    try {
      const response = await api.get('/hero');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create hero
  createHero: async (formData) => {
    try {
      const response = await api.post('/hero', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update hero
  updateHero: async (id, formData) => {
    try {
      const response = await api.put(`/hero/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete hero
  deleteHero: async (id) => {
    try {
      const response = await api.delete(`/hero/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
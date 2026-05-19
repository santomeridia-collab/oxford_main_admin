// src/services/gallery.service.js
import api from '../config/api.config';

export const galleryService = {
  // Get all gallery images
  getGallery: async () => {
    try {
      const response = await api.get('/gallery');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single gallery item
  getSingleGallery: async (id) => {
    try {
      const response = await api.get(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create gallery item
  createGallery: async (formData) => {
    try {
      const response = await api.post('/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update gallery item
  updateGallery: async (id, formData) => {
    try {
      const response = await api.put(`/gallery/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete gallery item
  deleteGallery: async (id) => {
    try {
      const response = await api.delete(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
// src/services/news.service.js
import api from '../config/api.config';

export const newsService = {
  // Get all news and blogs
  getAllNews: async () => {
    try {
      const response = await api.get('/news');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get news by category (news or blog)
  getNewsByCategory: async (category) => {
    try {
      const response = await api.get(`/news/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single news/blog
  getSingleNews: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create news/blog
  createNews: async (formData) => {
    try {
      const response = await api.post('/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update news/blog
  updateNews: async (id, formData) => {
    try {
      const response = await api.put(`/news/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete news/blog
  deleteNews: async (id) => {
    try {
      const response = await api.delete(`/news/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
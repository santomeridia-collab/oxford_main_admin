// src/services/instructor.service.js
import api from '../config/api.config';

export const instructorService = {
  // Get all instructors
  getAllInstructors: async () => {
    try {
      const response = await api.get('/instructors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single instructor
  getSingleInstructor: async (id) => {
    try {
      const response = await api.get(`/instructors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create instructor
  createInstructor: async (formData) => {
    try {
      const response = await api.post('/instructors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update instructor
  updateInstructor: async (id, formData) => {
    try {
      const response = await api.put(`/instructors/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete instructor
  deleteInstructor: async (id) => {
    try {
      const response = await api.delete(`/instructors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
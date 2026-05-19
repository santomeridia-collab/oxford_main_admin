// src/services/contacts.service.js
import api from "../config/api.config";

export const contactsService = {
  // Get all contacts with optional submission_type filter
  getContacts: async (submission_type = "") => {
    try {
      const params = {};
      if (submission_type) {
        params.submission_type = submission_type;
      }
      const response = await api.get("/contact-management", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reviews only
  getReviews: async () => {
    try {
      const response = await api.get("/contact-management", {
        params: { submission_type: "review" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get review summary/statistics
  getReviewSummary: async () => {
    try {
      const response = await api.get("/contact-management/reviews-summary");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

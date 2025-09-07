import api from './api';

export const userService = {
  // Get all users (admin only)
  getAllUsers: (params = {}) => {
    return api.get('/users', { params });
  },

  // Get user by ID (admin only)
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  // Update user role (admin only)
  updateUserRole: (id, role) => {
    return api.put(`/users/${id}/role`, { role });
  },

  // Toggle user status (admin only)
  toggleUserStatus: (id) => {
    return api.put(`/users/${id}/toggle-status`);
  },

  // Get user's borrowing history (admin only)
  getUserBorrowingHistory: (id) => {
    return api.get(`/users/${id}/borrowing-history`);
  },

  // Get dashboard statistics (admin only)
  getDashboardStats: () => {
    return api.get('/users/dashboard-stats');
  }
};
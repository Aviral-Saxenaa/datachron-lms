const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getUserBorrowingHistory,
  getDashboardStats
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', auth, adminAuth, getAllUsers);

// @route   GET /api/users/dashboard-stats
// @desc    Get dashboard statistics (admin only)
// @access  Private (Admin)
router.get('/dashboard-stats', auth, adminAuth, getDashboardStats);

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private (Admin)
router.get('/:id', auth, adminAuth, getUserById);

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put('/:id/role', auth, adminAuth, updateUserRole);

// @route   PUT /api/users/:id/toggle-status
// @desc    Activate/Deactivate user (admin only)
// @access  Private (Admin)
router.put('/:id/toggle-status', auth, adminAuth, toggleUserStatus);

// @route   GET /api/users/:id/borrowing-history
// @desc    Get user's borrowing history (admin only)
// @access  Private (Admin)
router.get('/:id/borrowing-history', auth, adminAuth, getUserBorrowingHistory);

module.exports = router;
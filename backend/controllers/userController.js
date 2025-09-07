const User = require('../models/User');
const Book = require('../models/Book');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    // Add role filter if provided
    if (role && role !== 'all') {
      query.role = role;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('borrowedBooks.book', 'title author')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate/Activate user (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deactivating the current admin
    if (user._id.toString() === req.user.id && user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate your own admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's borrowing history (Admin only)
const getUserBorrowingHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('name email borrowedBooks')
      .populate('borrowedBooks.book', 'title author isbn');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User borrowing history retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        borrowedBooks: user.borrowedBooks
      }
    });
  } catch (error) {
    console.error('Get user borrowing history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard statistics (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBooks = await Book.countDocuments();
    const totalBorrowedBooks = await Book.aggregate([
      { $match: { borrowedBy: { $ne: [] } } },
      { $project: { borrowedCount: { $size: '$borrowedBy' } } },
      { $group: { _id: null, total: { $sum: '$borrowedCount' } } }
    ]);

    const borrowedCount = totalBorrowedBooks.length > 0 ? totalBorrowedBooks[0].total : 0;
    const availableBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableCopies' } } }
    ]);

    const availableCount = availableBooks.length > 0 ? availableBooks[0].total : 0;

    // Get recent activities
    const recentBorrows = await Book.find({ 'borrowedBy.0': { $exists: true } })
      .populate('borrowedBy.user', 'name email')
      .select('title author borrowedBy')
      .sort({ 'borrowedBy.borrowedAt': -1 })
      .limit(5);

    // Get popular books
    const popularBooks = await Book.aggregate([
      { $project: { title: 1, author: 1, borrowedCount: { $size: '$borrowedBy' } } },
      { $sort: { borrowedCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      stats: {
        totalUsers,
        totalBooks,
        borrowedBooks: borrowedCount,
        availableBooks: availableCount
      },
      recentBorrows: recentBorrows.map(book => ({
        book: { title: book.title, author: book.author },
        borrowedBy: book.borrowedBy[book.borrowedBy.length - 1]
      })),
      popularBooks
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getUserBorrowingHistory,
  getDashboardStats
};
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { validateBook, validateBookUpdate } = require('../middleware/validation');
const {
  getBooks,
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getMyBooks,
  searchBooks
} = require('../controllers/bookController');

// @route   GET /api/books
// @desc    Get all available books (for users)
// @access  Private
router.get('/', auth, getBooks);

// @route   GET /api/books/all
// @desc    Get all books including borrowed ones (admin only)
// @access  Private (Admin)
router.get('/all', auth, adminAuth, getAllBooks);

// @route   GET /api/books/search
// @desc    Search books by title/author
// @access  Private
router.get('/search', auth, searchBooks);

// @route   GET /api/books/my-books
// @desc    Get user's borrowed books
// @access  Private
router.get('/my-books', auth, getMyBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Private
router.get('/:id', auth, getBookById);

// @route   POST /api/books
// @desc    Add new book (admin only)
// @access  Private (Admin)
router.post('/', auth, adminAuth, validateBook, addBook);

// @route   PUT /api/books/:id
// @desc    Update book (admin only)
// @access  Private (Admin)
router.put('/:id', auth, adminAuth, validateBookUpdate, updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, adminAuth, deleteBook);

// @route   POST /api/books/:id/borrow
// @desc    Borrow a book
// @access  Private
router.post('/:id/borrow', auth, borrowBook);

// @route   POST /api/books/:id/return
// @desc    Return a book
// @access  Private
router.post('/:id/return', auth, returnBook);

module.exports = router;
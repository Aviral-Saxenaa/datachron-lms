import api from './api';

export const bookService = {
  // Get all available books (for users)
  getBooks: (params = {}) => {
    return api.get('/books', { params });
  },

  // Get all books including borrowed ones (admin only)
  getAllBooks: (params = {}) => {
    return api.get('/books/all', { params });
  },

  // Get single book by ID
  getBookById: (id) => {
    return api.get(`/books/${id}`);
  },

  // Search books
  searchBooks: (params = {}) => {
    return api.get('/books/search', { params });
  },

  // Get user's borrowed books
  getMyBooks: () => {
    return api.get('/books/my-books');
  },

  // Add new book (admin only)
  addBook: (bookData) => {
    return api.post('/books', bookData);
  },

  // Update book (admin only)
  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData);
  },

  // Delete book (admin only)
  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  },

  // Borrow a book
  borrowBook: (id) => {
    return api.post(`/books/${id}/borrow`);
  },

  // Return a book
  returnBook: (id) => {
    return api.post(`/books/${id}/return`);
  }
};
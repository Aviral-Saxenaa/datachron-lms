const Book = require('../models/Book');
const User = require('../models/User');

// Get all books (for users - only available books)
const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { isActive: true };

    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const books = await Book.find(query)
      .select('-borrowedBy')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      message: 'Books retrieved successfully',
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all books (for admin - including borrowed ones)
const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, status } = req.query;
    const query = {};

    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add status filter
    if (status === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (status === 'borrowed') {
      query.availableCopies = { $lt: '$totalCopies' };
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const books = await Book.find(query)
      .populate('borrowedBy.user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      message: 'All books retrieved successfully',
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // For regular users, don't show borrowedBy details
    if (req.user.role !== 'admin') {
      book.borrowedBy = undefined;
    } else {
      await book.populate('borrowedBy.user', 'name email');
    }

    res.json({
      message: 'Book retrieved successfully',
      book
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new book (Admin only)
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, description, category, publishedYear, totalCopies } = req.body;

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }

    const book = new Book({
      title,
      author,
      isbn,
      description,
      category,
      publishedYear,
      totalCopies,
      availableCopies: totalCopies
    });

    await book.save();

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If updating total copies, adjust available copies accordingly
    if (updates.totalCopies) {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      
      const borrowedCopies = book.totalCopies - book.availableCopies;
      updates.availableCopies = updates.totalCopies - borrowedCopies;
      
      if (updates.availableCopies < 0) {
        return res.status(400).json({ 
          message: 'Cannot reduce total copies below currently borrowed copies' 
        });
      }
    }

    const book = await Book.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is currently borrowed
    if (book.borrowedBy.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete book that is currently borrowed' 
      });
    }

    await Book.findByIdAndDelete(id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Borrow book
const borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isActive) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Check if user already borrowed this book
    const alreadyBorrowed = book.borrowedBy.some(
      borrow => borrow.user.toString() === userId
    );
    if (alreadyBorrowed) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    // Check if book is available
    if (!book.isAvailable()) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Borrow the book
    const borrowed = book.borrowBook(userId);
    if (!borrowed) {
      return res.status(400).json({ message: 'Unable to borrow book' });
    }

    await book.save();

    // Update user's borrowed books
    await User.findByIdAndUpdate(userId, {
      $push: {
        borrowedBooks: {
          book: id,
          borrowedAt: new Date(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      message: 'Book borrowed successfully',
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return the book
    const returned = book.returnBook(userId);
    if (!returned) {
      return res.status(400).json({ message: 'You have not borrowed this book' });
    }

    await book.save();

    // Update user's borrowed books
    await User.findByIdAndUpdate(userId, {
      $pull: {
        borrowedBooks: { book: id }
      }
    });

    res.json({
      message: 'Book returned successfully',
      book: {
        id: book._id,
        title: book.title,
        author: book.author
      }
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's borrowed books
const getMyBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('borrowedBooks.book', 'title author isbn category')
      .select('borrowedBooks');

    res.json({
      message: 'Borrowed books retrieved successfully',
      borrowedBooks: user.borrowedBooks
    });
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = {
      isActive: true,
      $text: { $search: q }
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const books = await Book.find(query)
      .select('-borrowedBy')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: { $meta: 'textScore' } });

    const total = await Book.countDocuments(query);

    res.json({
      message: 'Search results retrieved successfully',
      books,
      searchQuery: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};
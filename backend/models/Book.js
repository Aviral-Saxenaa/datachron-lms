const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Romance', 'Mystery', 'Fantasy', 'Horror', 'Self-Help', 'Business', 'Other']
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Published year must be valid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  totalCopies: {
    type: Number,
    required: [true, 'Total copies is required'],
    min: [1, 'Total copies must be at least 1']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies is required'],
    min: [0, 'Available copies cannot be negative']
  },
  borrowedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    borrowedAt: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
      }
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Virtual for borrowed copies count
bookSchema.virtual('borrowedCopies').get(function() {
  return this.borrowedBy.length;
});

// Method to check if book is available
bookSchema.methods.isAvailable = function() {
  return this.availableCopies > 0;
};

// Method to borrow book
bookSchema.methods.borrowBook = function(userId) {
  if (this.availableCopies > 0) {
    this.borrowedBy.push({
      user: userId,
      borrowedAt: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });
    this.availableCopies -= 1;
    return true;
  }
  return false;
};

// Method to return book
bookSchema.methods.returnBook = function(userId) {
  const borrowIndex = this.borrowedBy.findIndex(
    borrow => borrow.user.toString() === userId.toString()
  );
  
  if (borrowIndex !== -1) {
    this.borrowedBy.splice(borrowIndex, 1);
    this.availableCopies += 1;
    return true;
  }
  return false;
};

module.exports = mongoose.model('Book', bookSchema);
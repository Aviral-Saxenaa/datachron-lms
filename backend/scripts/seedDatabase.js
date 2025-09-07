const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models (simplified schemas for seeding)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  borrowedBooks: [{ 
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  description: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Romance', 'Mystery', 'Fantasy', 'Horror', 'Self-Help', 'Business', 'Other']
  },
  publishedYear: { type: Number },
  totalCopies: { type: Number, required: true, min: 1 },
  availableCopies: { type: Number, required: true, min: 0 },
  borrowedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create indexes for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);

// Sample books data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    category: "Fiction",
    publishedYear: 1925,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    category: "Fiction",
    publishedYear: 1960,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    category: "Fiction",
    publishedYear: 1949,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    description: "A controversial novel about teenage rebellion and alienation.",
    category: "Fiction",
    publishedYear: 1951,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    description: "A romantic novel about manners, upbringing, morality, and marriage in Georgian England.",
    category: "Romance",
    publishedYear: 1813,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "978-0-544-00341-5",
    description: "An epic high fantasy novel about the quest to destroy the One Ring.",
    category: "Fantasy",
    publishedYear: 1954,
    totalCopies: 6,
    availableCopies: 6
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0-7475-3269-9",
    description: "The first book in the Harry Potter series about a young wizard's adventures.",
    category: "Fantasy",
    publishedYear: 1997,
    totalCopies: 8,
    availableCopies: 8
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    isbn: "978-0-307-47572-8",
    description: "A mystery thriller involving art, history, and religious conspiracy.",
    category: "Mystery",
    publishedYear: 2003,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "978-1-4516-4853-9",
    description: "The authorized biography of Apple co-founder Steve Jobs.",
    category: "Biography",
    publishedYear: 2011,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0-06-231609-7",
    description: "An exploration of how Homo sapiens came to dominate the world.",
    category: "History",
    publishedYear: 2011,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "978-0-307-88789-4",
    description: "A methodology for developing businesses and products through validated learning.",
    category: "Business",
    publishedYear: 2011,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0-13-235088-4",
    description: "A handbook of agile software craftsmanship for writing clean, readable code.",
    category: "Technology",
    publishedYear: 2008,
    totalCopies: 3,
    availableCopies: 3
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@library.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('👤 Admin user created: admin@library.com / admin123');

    // Create demo user
    const userPassword = await bcrypt.hash('user123', salt);
    const demoUser = new User({
      name: 'Demo User',
      email: 'user@library.com',
      password: userPassword,
      role: 'user',
      isActive: true
    });

    await demoUser.save();
    console.log('👤 Demo user created: user@library.com / user123');

    // Create additional demo users
    const demoUsers = [
      { name: 'Alice Johnson', email: 'alice@library.com', password: 'alice123' },
      { name: 'Bob Smith', email: 'bob@library.com', password: 'bob123' },
      { name: 'Carol Davis', email: 'carol@library.com', password: 'carol123' }
    ];

    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'user',
        isActive: true
      });
      await user.save();
      console.log(`👤 User created: ${userData.email} / ${userData.password}`);
    }

    // Create sample books
    await Book.insertMany(sampleBooks);
    console.log(`📚 ${sampleBooks.length} books added to the library`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@library.com / admin123');
    console.log('User: user@library.com / user123');
    console.log('Additional users: alice@library.com / alice123, bob@library.com / bob123, carol@library.com / carol123');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();
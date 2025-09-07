import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { bookService } from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BookCard from '../../components/common/BookCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent books
      const booksResponse = await bookService.getBooks({ limit: 6 });
      setRecentBooks(booksResponse.data.books);
      
      // Fetch user's borrowed books
      const myBooksResponse = await bookService.getMyBooks();
      setMyBooks(myBooksResponse.data.borrowedBooks);
      
      // Calculate stats
      setStats({
        totalBooks: booksResponse.data.pagination.totalBooks,
        borrowedBooks: myBooksResponse.data.borrowedBooks.length,
        availableBooks: booksResponse.data.books.filter(book => book.availableCopies > 0).length
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      await bookService.borrowBook(bookId);
      toast.success('Book borrowed successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await bookService.returnBook(bookId);
      toast.success('Book returned successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white p-4 rounded">
            <h1 className="h3 mb-2">Welcome back, {user?.name}!</h1>
            <p className="mb-0">Discover and manage your favorite books</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card stats-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title">Total Books</h5>
                  <h2 className="display-6 mb-0">{stats.totalBooks}</h2>
                </div>
                <div className="ms-3">
                  <i className="bi bi-book display-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title">My Books</h5>
                  <h2 className="display-6 mb-0">{stats.borrowedBooks}</h2>
                </div>
                <div className="ms-3">
                  <i className="bi bi-bookmark display-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title">Available</h5>
                  <h2 className="display-6 mb-0">{stats.availableBooks}</h2>
                </div>
                <div className="ms-3">
                  <i className="bi bi-check-circle display-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <Link to="/books" className="btn btn-primary w-100">
                    <i className="bi bi-search me-2"></i>
                    Browse Books
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/my-books" className="btn btn-success w-100">
                    <i className="bi bi-bookmark me-2"></i>
                    My Books
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/profile" className="btn btn-info w-100">
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/books?category=Fiction" className="btn btn-outline-primary w-100">
                    <i className="bi bi-star me-2"></i>
                    Popular Fiction
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Borrowed Books */}
      {myBooks.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>My Borrowed Books</h4>
              <Link to="/my-books" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </div>
            <div className="row">
              {myBooks.slice(0, 3).map((borrowedBook) => (
                <div key={borrowedBook._id} className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">{borrowedBook.book.title}</h6>
                      <p className="card-text text-muted">by {borrowedBook.book.author}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Due: {new Date(borrowedBook.dueDate).toLocaleDateString()}
                        </small>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleReturnBook(borrowedBook.book._id)}
                        >
                          Return
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Books */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Recently Added Books</h4>
            <Link to="/books" className="btn btn-outline-primary btn-sm">
              View All Books
            </Link>
          </div>
          <div className="row">
            {recentBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBorrow={handleBorrowBook}
                onReturn={handleReturnBook}
                showActions={true}
                isAdmin={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
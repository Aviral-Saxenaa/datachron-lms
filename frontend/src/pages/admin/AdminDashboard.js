import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0
  });
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await userService.getDashboardStats();
      setStats(response.data.stats);
      setRecentBorrows(response.data.recentBorrows || []);
      setPopularBooks(response.data.popularBooks || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
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
          <div className="bg-dark text-white p-4 rounded">
            <h1 className="h3 mb-2">Admin Dashboard</h1>
            <p className="mb-0">Manage your library system efficiently</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title">Total Users</h5>
                  <h2 className="display-6 mb-0">{stats.totalUsers}</h2>
                </div>
                <div className="ms-3">
                  <i className="bi bi-people display-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white">
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
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title">Borrowed</h5>
                  <h2 className="display-6 mb-0">{stats.borrowedBooks}</h2>
                </div>
                <div className="ms-3">
                  <i className="bi bi-bookmark display-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
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
                  <Link to="/admin/books/add" className="btn btn-primary w-100">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Book
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/admin/books" className="btn btn-success w-100">
                    <i className="bi bi-book me-2"></i>
                    Manage Books
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/admin/users" className="btn btn-info w-100">
                    <i className="bi bi-people me-2"></i>
                    Manage Users
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/books" className="btn btn-outline-primary w-100">
                    <i className="bi bi-eye me-2"></i>
                    View as User
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Borrows */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Borrows</h5>
            </div>
            <div className="card-body">
              {recentBorrows.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentBorrows.map((borrow, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{borrow.book.title}</h6>
                          <p className="mb-1 text-muted">by {borrow.book.author}</p>
                          <small className="text-muted">
                            Borrowed by {borrow.borrowedBy.user.name}
                          </small>
                        </div>
                        <small className="text-muted">
                          {new Date(borrow.borrowedBy.borrowedAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3">No recent borrows</p>
              )}
            </div>
          </div>
        </div>

        {/* Popular Books */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Popular Books</h5>
            </div>
            <div className="card-body">
              {popularBooks.length > 0 ? (
                <div className="list-group list-group-flush">
                  {popularBooks.map((book, index) => (
                    <div key={book._id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{book.title}</h6>
                          <p className="mb-0 text-muted">by {book.author}</p>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-primary">
                            {book.borrowedCount} borrows
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3">No borrowing data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
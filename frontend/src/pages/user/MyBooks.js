import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getMyBooks();
      setBorrowedBooks(response.data.borrowedBooks);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      toast.error('Failed to load your books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await bookService.returnBook(bookId);
      toast.success('Book returned successfully!');
      fetchMyBooks(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <LoadingSpinner text="Loading your books..." />;
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Borrowed Books</h2>
          <p className="text-muted mb-0">
            You have {borrowedBooks.length} book{borrowedBooks.length !== 1 ? 's' : ''} borrowed
          </p>
        </div>
        <Link to="/books" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Browse More Books
        </Link>
      </div>

      {borrowedBooks.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h3 className="display-6">{borrowedBooks.length}</h3>
                  <p className="mb-0">Total Borrowed</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h3 className="display-6">
                    {borrowedBooks.filter(book => isOverdue(book.dueDate)).length}
                  </h3>
                  <p className="mb-0">Overdue</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h3 className="display-6">
                    {borrowedBooks.filter(book => 
                      getDaysUntilDue(book.dueDate) <= 3 && !isOverdue(book.dueDate)
                    ).length}
                  </h3>
                  <p className="mb-0">Due Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Books List */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Your Books</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Book Details</th>
                      <th>Borrowed Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedBooks.map((borrowedBook) => {
                      const daysUntilDue = getDaysUntilDue(borrowedBook.dueDate);
                      const overdue = isOverdue(borrowedBook.dueDate);
                      
                      return (
                        <tr key={borrowedBook._id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{borrowedBook.book.title}</h6>
                              <small className="text-muted">
                                by {borrowedBook.book.author}
                              </small>
                              <br />
                              <small className="text-muted">
                                ISBN: {borrowedBook.book.isbn}
                              </small>
                            </div>
                          </td>
                          <td>
                            <small>
                              {new Date(borrowedBook.borrowedAt).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <small>
                              {new Date(borrowedBook.dueDate).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            {overdue ? (
                              <span className="badge bg-danger">
                                Overdue ({Math.abs(daysUntilDue)} days)
                              </span>
                            ) : daysUntilDue <= 3 ? (
                              <span className="badge bg-warning">
                                Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="badge bg-success">
                                {daysUntilDue} days left
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/books/${borrowedBook.book._id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleReturnBook(borrowedBook.book._id)}
                              >
                                <i className="bi bi-arrow-return-left me-1"></i>
                                Return
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-bookmark display-1 text-muted"></i>
          <h4 className="mt-3">No books borrowed yet</h4>
          <p className="text-muted mb-4">
            Start exploring our collection and borrow your first book!
          </p>
          <Link to="/books" className="btn btn-primary">
            <i className="bi bi-search me-2"></i>
            Browse Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      setBook(response.data.book);
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Failed to load book details');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async () => {
    try {
      await bookService.borrowBook(id);
      toast.success('Book borrowed successfully!');
      fetchBookDetails(); // Refresh book details
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturnBook = async () => {
    try {
      await bookService.returnBook(id);
      toast.success('Book returned successfully!');
      fetchBookDetails(); // Refresh book details
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading book details..." />;
  }

  if (!book) {
    return (
      <div className="text-center py-5">
        <h4>Book not found</h4>
        <Link to="/books" className="btn btn-primary">
          Back to Books
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="fade-in">
      {/* Back Button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <div className="row">
        {/* Book Details */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="bg-light p-4 rounded text-center mb-3">
                    <i className="bi bi-book display-1 text-muted"></i>
                  </div>
                </div>
                <div className="col-md-8">
                  <h1 className="h3 mb-2">{book.title}</h1>
                  <h2 className="h5 text-muted mb-3">by {book.author}</h2>
                  
                  <div className="mb-3">
                    <span className="badge bg-secondary me-2">{book.category}</span>
                    {book.publishedYear && (
                      <span className="badge bg-info">{book.publishedYear}</span>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-6">
                      <strong>ISBN:</strong> {book.isbn}
                    </div>
                    <div className="col-sm-6">
                      <strong>Available:</strong> {book.availableCopies} / {book.totalCopies}
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className={`badge fs-6 ${isAvailable ? 'bg-success' : 'bg-danger'}`}>
                      {isAvailable ? 'Available for Borrowing' : 'Currently Unavailable'}
                    </span>
                  </div>

                  {book.description && (
                    <div>
                      <h5>Description</h5>
                      <p className="text-muted">{book.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Actions</h5>
            </div>
            <div className="card-body">
              {isAvailable ? (
                <button 
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleBorrowBook}
                >
                  <i className="bi bi-bookmark-plus me-2"></i>
                  Borrow This Book
                </button>
              ) : (
                <button className="btn btn-secondary w-100 mb-3" disabled>
                  <i className="bi bi-x-circle me-2"></i>
                  Not Available
                </button>
              )}

              <Link to="/books" className="btn btn-outline-primary w-100 mb-3">
                <i className="bi bi-search me-2"></i>
                Browse More Books
              </Link>

              <Link to="/my-books" className="btn btn-outline-success w-100">
                <i className="bi bi-bookmark me-2"></i>
                My Borrowed Books
              </Link>
            </div>
          </div>

          {/* Book Information */}
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">Book Information</h6>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-6">
                  <small className="text-muted">Category:</small>
                </div>
                <div className="col-6">
                  <small>{book.category}</small>
                </div>
              </div>
              
              {book.publishedYear && (
                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted">Published:</small>
                  </div>
                  <div className="col-6">
                    <small>{book.publishedYear}</small>
                  </div>
                </div>
              )}
              
              <div className="row mb-2">
                <div className="col-6">
                  <small className="text-muted">Total Copies:</small>
                </div>
                <div className="col-6">
                  <small>{book.totalCopies}</small>
                </div>
              </div>
              
              <div className="row">
                <div className="col-6">
                  <small className="text-muted">Available:</small>
                </div>
                <div className="col-6">
                  <small className={isAvailable ? 'text-success' : 'text-danger'}>
                    {book.availableCopies}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
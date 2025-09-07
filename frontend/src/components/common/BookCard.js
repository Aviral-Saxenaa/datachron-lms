import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onBorrow, onReturn, showActions = true, isAdmin = false }) => {
  const isAvailable = book.availableCopies > 0;
  const isBorrowed = book.borrowedBy && book.borrowedBy.some(borrow => borrow.user);

  const handleBorrow = (e) => {
    e.preventDefault();
    if (onBorrow) {
      onBorrow(book._id);
    }
  };

  const handleReturn = (e) => {
    e.preventDefault();
    if (onReturn) {
      onReturn(book._id);
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card book-card h-100">
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">by {book.author}</h6>
          
          <div className="mb-2">
            <span className="badge bg-secondary me-2">{book.category}</span>
            {book.publishedYear && (
              <span className="badge bg-info">{book.publishedYear}</span>
            )}
          </div>

          {book.description && (
            <p className="card-text">
              {book.description.length > 100 
                ? `${book.description.substring(0, 100)}...` 
                : book.description
              }
            </p>
          )}

          <div className="mb-3">
            <small className="text-muted">
              <strong>ISBN:</strong> {book.isbn}<br />
              <strong>Available:</strong> {book.availableCopies} / {book.totalCopies}
            </small>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className={`badge ${isAvailable ? 'bg-success' : 'bg-danger'}`}>
                {isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>

            {showActions && (
              <div className="btn-group" role="group">
                <Link 
                  to={`/books/${book._id}`} 
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-eye"></i>
                </Link>
                
                {!isAdmin && isAvailable && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleBorrow}
                  >
                    <i className="bi bi-bookmark-plus me-1"></i>
                    Borrow
                  </button>
                )}

                {!isAdmin && isBorrowed && (
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={handleReturn}
                  >
                    <i className="bi bi-bookmark-dash me-1"></i>
                    Return
                  </button>
                )}

                {isAdmin && (
                  <>
                    <Link 
                      to={`/admin/books/edit/${book._id}`}
                      className="btn btn-warning btn-sm"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => {/* Handle delete */}}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
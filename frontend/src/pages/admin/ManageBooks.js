import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    page: 1
  });

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
    'Biography', 'Romance', 'Mystery', 'Fantasy', 'Horror',
    'Self-Help', 'Business', 'Other'
  ];

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: filters.page,
        limit: 10
      };

      if (filters.category !== 'all') {
        params.category = filters.category;
      }

      if (filters.status !== 'all') {
        params.status = filters.status;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      const response = await bookService.getAllBooks(params);
      setBooks(response.data.books);
      setPagination(response.data.pagination);
      
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category,
      page: 1
    }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({
      ...prev,
      status: e.target.value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await bookService.deleteBook(bookId);
        toast.success('Book deleted successfully!');
        fetchBooks(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Manage Books</h2>
          <p className="text-muted mb-0">
            Total: {pagination.totalBooks} books
          </p>
        </div>
        <Link to="/admin/books/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Book
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="search-container">
        <div className="row g-3">
          <div className="col-md-5">
            <SearchBar
              onSearch={handleSearch}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.status}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading books..." />}

      {/* Books Table */}
      {!loading && (
        <>
          {books.length > 0 ? (
            <div className="table-container">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Book Details</th>
                    <th>Category</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{book.title}</h6>
                          <small className="text-muted">
                            by {book.author} | ISBN: {book.isbn}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{book.category}</span>
                      </td>
                      <td>
                        <div>
                          <strong>{book.availableCopies}</strong> / {book.totalCopies}
                          <br />
                          <small className="text-muted">
                            {book.borrowedBy.length} borrowed
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          book.availableCopies > 0 ? 'bg-success' : 'bg-danger'
                        }`}>
                          {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/books/${book._id}`}
                            className="btn btn-outline-primary btn-sm"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link
                            to={`/admin/books/edit/${book._id}`}
                            className="btn btn-warning btn-sm"
                            title="Edit Book"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteBook(book._id, book.title)}
                            disabled={book.borrowedBy.length > 0}
                            title={book.borrowedBy.length > 0 ? 'Cannot delete borrowed book' : 'Delete Book'}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-book display-1 text-muted"></i>
              <h4 className="mt-3">No books found</h4>
              <p className="text-muted">
                {filters.search || filters.category !== 'all' || filters.status !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Start by adding your first book'
                }
              </p>
              <Link to="/admin/books/add" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add First Book
              </Link>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        </>
      )}
    </div>
  );
};

export default ManageBooks;
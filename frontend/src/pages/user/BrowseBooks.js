import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BookCard from '../../components/common/BookCard';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';

const BrowseBooks = () => {
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
        limit: 12
      };

      if (filters.category !== 'all') {
        params.category = filters.category;
      }

      let response;
      if (filters.search) {
        params.q = filters.search;
        response = await bookService.searchBooks(params);
      } else {
        response = await bookService.getBooks(params);
      }

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

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleBorrowBook = async (bookId) => {
    try {
      await bookService.borrowBook(bookId);
      toast.success('Book borrowed successfully!');
      fetchBooks(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await bookService.returnBook(bookId);
      toast.success('Book returned successfully!');
      fetchBooks(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Browse Books</h2>
          <p className="text-muted mb-0">
            Discover and borrow from our collection of {pagination.totalBooks} books
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />

      {/* Results Info */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {filters.search && (
            <p className="mb-0">
              Search results for "<strong>{filters.search}</strong>"
              {filters.category !== 'all' && ` in ${filters.category}`}
            </p>
          )}
          {!filters.search && filters.category !== 'all' && (
            <p className="mb-0">
              Showing books in <strong>{filters.category}</strong>
            </p>
          )}
        </div>
        <div>
          <small className="text-muted">
            Showing {books.length} of {pagination.totalBooks} books
          </small>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading books..." />}

      {/* Books Grid */}
      {!loading && (
        <>
          {books.length > 0 ? (
            <div className="row">
              {books.map((book) => (
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
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h4 className="mt-3">No books found</h4>
              <p className="text-muted">
                {filters.search || filters.category !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No books are currently available'
                }
              </p>
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

export default BrowseBooks;
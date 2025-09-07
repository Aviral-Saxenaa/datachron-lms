import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    publishedYear: '',
    totalCopies: 1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalBook, setOriginalBook] = useState(null);

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
    'Biography', 'Romance', 'Mystery', 'Fantasy', 'Horror',
    'Self-Help', 'Business', 'Other'
  ];

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      const book = response.data.book;
      
      setOriginalBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        category: book.category || '',
        publishedYear: book.publishedYear || '',
        totalCopies: book.totalCopies || 1
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/admin/books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const bookData = {
        ...formData,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        totalCopies: parseInt(formData.totalCopies)
      };

      await bookService.updateBook(id, bookData);
      toast.success('Book updated successfully!');
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading book details..." />;
  }

  if (!originalBook) {
    return (
      <div className="text-center py-5">
        <h4>Book not found</h4>
        <Link to="/admin/books" className="btn btn-primary">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Edit Book</h2>
          <p className="text-muted mb-0">Update book information</p>
        </div>
        <Link to="/admin/books" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Books
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="title" className="form-label">
                      Book Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter book title"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="author" className="form-label">
                      Author <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      placeholder="Enter author name"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="isbn" className="form-label">
                      ISBN <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                      placeholder="Enter ISBN"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="publishedYear" className="form-label">
                      Published Year
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="publishedYear"
                      name="publishedYear"
                      value={formData.publishedYear}
                      onChange={handleChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      placeholder="Enter published year"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="totalCopies" className="form-label">
                      Total Copies <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="totalCopies"
                      name="totalCopies"
                      value={formData.totalCopies}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="Enter number of copies"
                    />
                    <div className="form-text">
                      Currently borrowed: {originalBook.totalCopies - originalBook.availableCopies} copies
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter book description (optional)"
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating Book...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Update Book
                      </>
                    )}
                  </button>
                  <Link to="/admin/books" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
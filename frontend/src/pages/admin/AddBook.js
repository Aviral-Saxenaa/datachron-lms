import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../../services/bookService';

const AddBook = () => {
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
  const [loading, setLoading] = useState(false);

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
    'Biography', 'Romance', 'Mystery', 'Fantasy', 'Horror',
    'Self-Help', 'Business', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookData = {
        ...formData,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        totalCopies: parseInt(formData.totalCopies)
      };

      await bookService.addBook(bookData);
      toast.success('Book added successfully!');
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Add New Book</h2>
          <p className="text-muted mb-0">Add a new book to the library collection</p>
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding Book...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Book
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

export default AddBook;
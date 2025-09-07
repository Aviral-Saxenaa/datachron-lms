import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile({
        name: formData.name
      });
      
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Profile Header */}
          <div className="card mb-4">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-person-circle display-1 text-muted"></i>
              </div>
              <h3>{user.name}</h3>
              <p className="text-muted">{user.email}</p>
              <span className={`badge fs-6 ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Profile Information</h5>
              {!isEditing && (
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit
                </button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                  <div className="form-text">
                    Email cannot be changed. Contact administrator if needed.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Member Since</label>
                  <input
                    type="text"
                    className="form-control"
                    value={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    disabled
                  />
                </div>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-1"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">Account Statistics</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="border-end">
                    <h4 className="text-primary">{user.borrowedBooks?.length || 0}</h4>
                    <small className="text-muted">Books Borrowed</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border-end">
                    <h4 className="text-success">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </h4>
                    <small className="text-muted">Account Status</small>
                  </div>
                </div>
                <div className="col-4">
                  <h4 className="text-info">
                    {new Date(user.createdAt || Date.now()).getFullYear()}
                  </h4>
                  <small className="text-muted">Year Joined</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
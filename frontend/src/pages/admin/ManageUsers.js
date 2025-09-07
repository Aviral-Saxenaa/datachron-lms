import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    page: 1
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: filters.page,
        limit: 10
      };

      if (filters.role !== 'all') {
        params.role = filters.role;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      const response = await userService.getAllUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleRoleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      role: e.target.value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await userService.toggleUserStatus(userId);
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await userService.updateUserRole(userId, newRole);
        toast.success('User role updated successfully!');
        fetchUsers(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Manage Users</h2>
          <p className="text-muted mb-0">
            Total: {pagination.totalUsers} users
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="search"
                  placeholder="Search users by name or email..."
                  defaultValue={filters.search}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.role}
                onChange={handleRoleChange}
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilters({ search: '', role: 'all', page: 1 });
                  document.querySelector('input[name="search"]').value = '';
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading users..." />}

      {/* Users Table */}
      {!loading && (
        <>
          {users.length > 0 ? (
            <div className="table-container">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User Details</th>
                    <th>Role</th>
                    <th>Borrowed Books</th>
                    <th>Status</th>
                    <th>Member Since</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          user.role === 'admin' ? 'bg-danger' : 'bg-primary'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {user.borrowedBooks?.length || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          user.isActive ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-primary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              Role
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateUserRole(user._id, 'user')}
                                  disabled={user.role === 'user'}
                                >
                                  Make User
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateUserRole(user._id, 'admin')}
                                  disabled={user.role === 'admin'}
                                >
                                  Make Admin
                                </button>
                              </li>
                            </ul>
                          </div>
                          
                          <button
                            className={`btn btn-sm ${
                              user.isActive ? 'btn-warning' : 'btn-success'
                            }`}
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            <i className={`bi ${
                              user.isActive ? 'bi-pause-circle' : 'bi-play-circle'
                            }`}></i>
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
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="mt-3">No users found</h4>
              <p className="text-muted">
                {filters.search || filters.role !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No users are registered yet'
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

export default ManageUsers;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const userMenuItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/books', icon: 'bi-book', label: 'Browse Books' },
    { path: '/my-books', icon: 'bi-bookmark', label: 'My Books' },
    { path: '/profile', icon: 'bi-person', label: 'Profile' }
  ];

  const adminMenuItems = [
    { path: '/admin', icon: 'bi-speedometer2', label: 'Admin Dashboard' },
    { path: '/admin/books', icon: 'bi-book', label: 'Manage Books' },
    { path: '/admin/users', icon: 'bi-people', label: 'Manage Users' }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="sidebar">
      <div className="p-3">
        <h6 className="text-light mb-3">
          {user?.role === 'admin' ? 'Admin Panel' : 'User Menu'}
        </h6>
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path)}`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
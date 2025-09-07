import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import BrowseBooks from './pages/user/BrowseBooks';
import MyBooks from './pages/user/MyBooks';
import BookDetails from './pages/user/BookDetails';
import Profile from './pages/user/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageUsers from './pages/admin/ManageUsers';
import AddBook from './pages/admin/AddBook';
import EditBook from './pages/admin/EditBook';

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar />
      
      <div className="container-fluid">
        <div className="row">
          {isAuthenticated && (
            <div className="col-md-3 col-lg-2 px-0">
              <Sidebar />
            </div>
          )}
          
          <div className={`${isAuthenticated ? 'col-md-9 col-lg-10' : 'col-12'}`}>
            <main className="main-content">
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/login" 
                  element={
                    !isAuthenticated ? <Login /> : 
                    <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    !isAuthenticated ? <Register /> : 
                    <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />
                  } 
                />

                {/* Protected User routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/books" 
                  element={
                    <ProtectedRoute>
                      <BrowseBooks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/books/:id" 
                  element={
                    <ProtectedRoute>
                      <BookDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-books" 
                  element={
                    <ProtectedRoute>
                      <MyBooks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected Admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/books" 
                  element={
                    <ProtectedRoute adminOnly>
                      <ManageBooks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/books/add" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AddBook />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/books/edit/:id" 
                  element={
                    <ProtectedRoute adminOnly>
                      <EditBook />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute adminOnly>
                      <ManageUsers />
                    </ProtectedRoute>
                  } 
                />

                {/* Default redirects */}
                <Route 
                  path="/" 
                  element={
                    isAuthenticated ? 
                      <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} /> :
                      <Navigate to="/login" />
                  } 
                />
                
                {/* 404 fallback */}
                <Route 
                  path="*" 
                  element={
                    <div className="text-center mt-5">
                      <h2>404 - Page Not Found</h2>
                      <p>The page you're looking for doesn't exist.</p>
                    </div>
                  } 
                />
              </Routes>
            </main>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
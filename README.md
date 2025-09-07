# Library Management System

A complete full-stack Library Management System with separate Admin and User functionalities.

## Features

### Backend (REST API)
- Node.js + Express
- MongoDB Database
- JWT Authentication with 2 roles (Admin/User)
- Complete CRUD operations for books
- User registration and authentication

### Frontend (React.js)
- Responsive UI (mobile + desktop)
- Admin Dashboard for book management
- User Dashboard for browsing and borrowing books
- React Router for navigation
- Context API for state management

## Project Structure

```
library-management-system/
├── backend/                 # Node.js + Express API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── config/            # Database and JWT config
│   └── server.js          # Main server file
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/
└── docs/                  # API documentation
```

## Getting Started

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Books (Admin)
- POST `/api/books` - Add new book
- PUT `/api/books/:id` - Update book
- DELETE `/api/books/:id` - Delete book
- GET `/api/books/all` - View all books (including borrowed)

### Books (User)
- GET `/api/books` - View available books
- GET `/api/books/search` - Search books
- POST `/api/books/:id/borrow` - Borrow a book
- POST `/api/books/:id/return` - Return a book
- GET `/api/books/my-books` - View borrowed books

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend**: React.js, React Router, Axios, Context API
- **Development**: Nodemon, Concurrently
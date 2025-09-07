# Library Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All API responses follow this format:
```json
{
  "message": "Success message",
  "data": {}, // Response data
  "error": "Error message (if any)"
}
```

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

### Login User
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer <token>`

### Update Profile
- **PUT** `/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Updated Name"
}
```

## Book Endpoints

### Get Available Books (User)
- **GET** `/books`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `category` (string): Filter by category
  - `search` (string): Search in title/author

### Get All Books (Admin)
- **GET** `/books/all`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only
- **Query Parameters:** Same as above plus:
  - `status` (string): 'available' or 'borrowed'

### Search Books
- **GET** `/books/search`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `q` (string): Search query (required)
  - `category` (string): Filter by category
  - `page` (number): Page number
  - `limit` (number): Items per page

### Get Book by ID
- **GET** `/books/:id`
- **Headers:** `Authorization: Bearer <token>`

### Add Book (Admin)
- **POST** `/books`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only
- **Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "978-0123456789",
  "description": "Book description",
  "category": "Fiction",
  "publishedYear": 2023,
  "totalCopies": 5
}
```

### Update Book (Admin)
- **PUT** `/books/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only
- **Body:** Same as Add Book (all fields optional)

### Delete Book (Admin)
- **DELETE** `/books/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only

### Borrow Book
- **POST** `/books/:id/borrow`
- **Headers:** `Authorization: Bearer <token>`

### Return Book
- **POST** `/books/:id/return`
- **Headers:** `Authorization: Bearer <token>`

### Get My Borrowed Books
- **GET** `/books/my-books`
- **Headers:** `Authorization: Bearer <token>`

## User Management Endpoints (Admin Only)

### Get All Users
- **GET** `/users`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only
- **Query Parameters:**
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `role` (string): Filter by role
  - `search` (string): Search by name/email

### Get User by ID
- **GET** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only

### Update User Role
- **PUT** `/users/:id/role`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only
- **Body:**
```json
{
  "role": "admin" // or "user"
}
```

### Toggle User Status
- **PUT** `/users/:id/toggle-status`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only

### Get Dashboard Statistics
- **GET** `/users/dashboard-stats`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Admin only

## Error Codes

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

## Book Categories

Available categories:
- Fiction
- Non-Fiction
- Science
- Technology
- History
- Biography
- Romance
- Mystery
- Fantasy
- Horror
- Self-Help
- Business
- Other

## User Roles

- **user**: Can browse, search, borrow, and return books
- **admin**: Can do everything users can do plus manage books and users